<?php
use AmoCRM\Client\AmoCRMApiClient;
use AmoCRM\Collections\CustomFieldsValuesCollection;
use AmoCRM\Collections\LinksCollection;
use AmoCRM\Collections\NotesCollection;
use AmoCRM\Filters\ContactsFilter;
use AmoCRM\Helpers\EntityTypesInterface;
use AmoCRM\Models\ContactModel;
use AmoCRM\Models\CustomFieldsValues\MultitextCustomFieldValuesModel;
use AmoCRM\Models\CustomFieldsValues\MultiselectCustomFieldValuesModel;
use AmoCRM\Models\CustomFieldsValues\SelectCustomFieldValuesModel;
use AmoCRM\Models\CustomFieldsValues\TextCustomFieldValuesModel;
use AmoCRM\Models\CustomFieldsValues\ValueCollections\MultitextCustomFieldValueCollection;
use AmoCRM\Models\CustomFieldsValues\ValueCollections\MultiselectCustomFieldValueCollection;
use AmoCRM\Models\CustomFieldsValues\ValueCollections\SelectCustomFieldValueCollection;
use AmoCRM\Models\CustomFieldsValues\ValueCollections\TextCustomFieldValueCollection;
use AmoCRM\Models\CustomFieldsValues\ValueModels\MultitextCustomFieldValueModel;
use AmoCRM\Models\CustomFieldsValues\ValueModels\MultiselectCustomFieldValueModel;
use AmoCRM\Models\CustomFieldsValues\ValueModels\SelectCustomFieldValueModel;
use AmoCRM\Models\CustomFieldsValues\ValueModels\TextCustomFieldValueModel;
use AmoCRM\Models\LeadModel;
use AmoCRM\Collections\ContactsCollection;
use AmoCRM\Collections\Leads\Unsorted\UnsortedCollection;
use AmoCRM\Models\NoteType\CommonNote;
use AmoCRM\Collections\Leads\Unsorted\FormsUnsortedCollection;
use AmoCRM\Models\Unsorted\FormUnsortedModel;
use AmoCRM\Models\Unsorted\FormsMetadata;
use AmoCRM\Collections\TasksCollection;
use AmoCRM\Models\TaskModel;
use AmoCRM\Collections\TagsCollection;
use AmoCRM\Models\TagModel;
use AmoCRM\Collections\Leads\LeadsCollection;
use League\OAuth2\Client\Token\AccessTokenInterface;
use AmoCRM\Filters\LeadsFilter;

define('TOKEN_FILE', 'token_info.json');

class LeadgenAmoClient {
    protected $apiClient;
   

    function __construct(string $baseDomain, string $clientId, string $clientSecret, string $redirectUri, bool $refresh) {
        try {
            $apiClient = new AmoCRMApiClient($clientId, $clientSecret, $redirectUri);
            $accessToken = $this->getToken();
            $apiClient
              ->setAccountBaseDomain($baseDomain)
              ->onAccessTokenRefresh(
                function (AccessTokenInterface $accessToken, string $baseDomain) {
                  $this->saveToken(
                    [
                      'accessToken' => $accessToken->getToken(),
                      'refreshToken' => $accessToken->getRefreshToken(),
                      'expires' => $accessToken->getExpires(),
                      'baseDomain' => $baseDomain,
                    ]
                  );
                }
              );
        
            if ($accessToken->hasExpired() || $refresh) {
              try {
                $accessToken = $apiClient->getOAuthClient()->getAccessTokenByRefreshToken($accessToken);
                
                $this->saveToken([
                  'accessToken' => $accessToken->getToken(),
                  'refreshToken' => $accessToken->getRefreshToken(),
                  'expires' => $accessToken->getExpires(),
                  'baseDomain' => $apiClient->getAccountBaseDomain(),
                ]);
              } catch (Exception $e) {
                echo "<pre>";var_dump($e);echo"</pre>";
                //die((string)$e);
              }
            }
            $apiClient->setAccessToken($accessToken);
          } catch (AmoCRMApiException $e) {
            echo "<pre>";var_dump($e);echo"</pre>";
            die;
          }
          $this->apiClient = $apiClient;
    }

     //получает лид по id
    public function getLeadById(int $leadID): AmoCRM\Models\LeadModel
    {
      $lead = $this->apiClient->leads()->getOne($leadID, [LeadModel::CONTACTS, LeadModel::CATALOG_ELEMENTS]);
      return $lead;
    }

    //добавляем лид в crm
    public function addLeadToCrm(string $phone, int $status, string $city) {
      $resp = 2614462;
      $leadName = "Сделка входящий звонок (Даша)";
      try{
        $contact = new ContactModel();
        $contact->setResponsibleUserId($resp);
        $customFields = new CustomFieldsValuesCollection();
        $phoneField = (new MultitextCustomFieldValuesModel())->setFieldCode('PHONE');
        $phoneField->setValues(
          (new MultitextCustomFieldValueCollection())
            ->add(
              (new MultitextCustomFieldValueModel())
                ->setEnum('MOB')
                ->setValue($phone)
            )
        );
        $customFields->add($phoneField);
        $contact->setCustomFieldsValues($customFields);
        $apiContact = $this->apiClient->contacts()->addOne($contact);
        $contactId = $apiContact->getId();
        $lead = new LeadModel();
        $leadCustomFieldsValues  = new CustomFieldsValuesCollection();
        $lead
          ->setName($leadName)
          ->setStatusId($status)
          ->setResponsibleUserId($resp);
        $cityNameCustomFieldsValues  = new TextCustomFieldValuesModel();
        $cityNameCustomFieldsValues
          ->setFieldId(416699)
          ->setValues(
            (new TextCustomFieldValueCollection())
              ->add((new TextCustomFieldValueModel())->setValue($city))
          );
        $cityNameCustomFieldsValues2  = new TextCustomFieldValuesModel();
        $cityNameCustomFieldsValues2
          ->setFieldId(467915)
          ->setValues(
            (new TextCustomFieldValueCollection())
              ->add((new TextCustomFieldValueModel())->setValue($city))
          );
        
        $leadCustomFieldsValues
          ->add($cityNameCustomFieldsValues)
          ->add($cityNameCustomFieldsValues2);
        
        $lead->setCustomFieldsValues($leadCustomFieldsValues);
        $apiLead = $this->apiClient->leads()->addOne($lead);
        $links = new LinksCollection();
        $links->add($apiContact);
        $this->apiClient->leads()->link($lead, $links);
        return $apiLead;
      } catch (\Exception $e) {
        echo "<pre>";var_dump($e);echo "</pre>";
        return false;
      }
    }

    //добавляет комментарий к лиду
    public function addCommentToLead(AmoCRM\Models\LeadModel $lead, string $text)
    {
      $notes = new NotesCollection();
      $comment = new \AmoCRM\Models\NoteType\CommonNote();
      $comment->setEntityId($lead->getId())
        ->setResponsibleUserId($lead->getResponsibleUserId())
        ->setText(str_replace("_", " ", $text));

      $leadNotesService = $this->apiClient->notes(EntityTypesInterface::LEADS);
      $notesCollection = $leadNotesService->addOne($comment);
    }

    //обновляет статус лида
    public function updateLeadStatus(AmoCRM\Models\LeadModel $lead, int $newStatus): bool
    {
      try {
        $lead->setStatusId($newStatus);
        $leadsCollection = new LeadsCollection();
        $leadsCollection->add($lead);
        $this->apiClient->leads()->update($leadsCollection);
        return true;
      } catch (AmoCRMApiException $e) {
        return false;
      }
    }

    //функция получает номер телефона из лида
    public function getLeadsPhoneNumber(AmoCRM\Models\LeadModel $lead): string
    {
      $leadContacts = $lead->getContacts();
      if ($leadContacts) {
        $leadMainContact = $leadContacts->getBy('isMain', true);
        $contactID = $leadMainContact->getId();
        $contact = $this->apiClient->contacts()->getOne($contactID);
        $customFields = $contact->getCustomFieldsValues();
        $phoneFiled = $customFields->getBy('fieldCode', 'PHONE');
        return $phoneFiled->getValues()->first()->getValue();
      }
      return null;
    }

    //функция возвращает город из лида
    public function getLeadsCity(AmoCRM\Models\LeadModel $lead): string
    {
      try {
        $customFields = $lead->getCustomFieldsValues();
        $city = $customFields->getBy('fieldId', 467915)->getValues()[0]->getValue();
        return $city;
      } catch (\Throwable $e) {
        return "";
      }
    }

    //ищет лиды в заданом статусе
    public function getLeadsOfPipelineInStatus(int $pipelineID, int $statusID): AmoCRM\Collections\Leads\LeadsCollection
    {
      try {
        $filter = new LeadsFilter();
        $filter->setStatuses([array(
          "pipeline_id" => $pipelineID,
          "status_id" => $statusID,
        )]);


        $leads = $this->apiClient->leads()->get($filter, [LeadModel::IS_PRICE_BY_ROBOT, LeadModel::LOSS_REASON, LeadModel::CONTACTS]);
      } catch (AmoCRMApiException $e) {
        printError($e);
      }
      return $leads;
    }

    protected function getToken()
    {
      $accessToken = json_decode(file_get_contents(TOKEN_FILE), true);

      if (
        isset($accessToken)
        && isset($accessToken['accessToken'])
        && isset($accessToken['refreshToken'])
        && isset($accessToken['expires'])
        && isset($accessToken['baseDomain'])
      ) {
        return new \League\OAuth2\Client\Token\AccessToken([
          'access_token' => $accessToken['accessToken'],
          'refresh_token' => $accessToken['refreshToken'],
          'expires' => $accessToken['expires'],
          'baseDomain' => $accessToken['baseDomain'],
        ]);
      } else {
        exit('Invalid access token ' . var_export($accessToken, true));
      }
    }

    protected function saveToken($accessToken)
    {
        if (
            isset($accessToken)
            && isset($accessToken['accessToken'])
            && isset($accessToken['refreshToken'])
            && isset($accessToken['expires'])
            && isset($accessToken['baseDomain'])
        ) {
            $data = [
            'accessToken' => $accessToken['accessToken'],
            'expires' => $accessToken['expires'],
            'refreshToken' => $accessToken['refreshToken'],
            'baseDomain' => $accessToken['baseDomain'],
            ];

            file_put_contents(TOKEN_FILE, json_encode($data));
        } else {
            exit('Invalid access token ' . var_export($accessToken, true));
        }
    }
}