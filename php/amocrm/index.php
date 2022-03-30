<?

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

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
require "../vendor/autoload.php";

$baseDomain = $_ENV["AMO_DOMAIN"];
$clientId = $_ENV["AMO_ID"];
$clientSecret = $_ENV["AMO_SECRET"];
$redirectUri = $_ENV["AMO_REDIRECT_URI"];

include "amo_client.php";
$amoClient = new LeadgenAmoClient($baseDomain, $clientId, $clientSecret, $redirectUri);
//$lead = $amoClient->getLeadById(29201257);
//var_dump($amoClient->getLeadsPhoneNumber($lead));
var_dump($amoClient->getLeadsOfPipelineInStatus(2010945, 29589345));




