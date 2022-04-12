<?
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
require "../vendor/autoload.php";
require_once "repository.php";
require_once "amo_client.php";

$baseDomain = $_ENV["AMO_DOMAIN"];
$clientId = $_ENV["AMO_ID"];
$clientSecret = $_ENV["AMO_SECRET"];
$redirectUri = $_ENV["AMO_REDIRECT_URI"];
if (isset($_REQUEST["refresh"])){
  $amoClient = new LeadgenAmoClient($baseDomain, $clientId, $clientSecret, $redirectUri, true);
  die('refresh required');
}
$amoClient = new LeadgenAmoClient($baseDomain, $clientId, $clientSecret, $redirectUri, false);
$repsoitory = new Repository($_ENV["APP_DSN"]);

$amoBufList = $repsoitory->getAmoBuffList(20);

foreach($amoBufList as $item) {
  //типы заданий amobuf
  //echo"<pre>";var_dump($item);echo"</pre>";
  switch ($item->type) {
    case 0:
      //добавляем лид
      $result = addLead($amoClient, $item->phone, $item->newStatus, $item->city, $item->comment);
      if ($result) {
        //если успешно, то удаляем amoBuf
        $result = $repsoitory->deleteAmoBufTask($item->_id);
        if ($result) {
          var_dump('task successfully done');
        }
      } else {
        //добавить логирование ошибки
        var_dump('failed');
      };
      break;
    case 1: 
      //обновляем лид
      $result = updateLeadInfo($amoClient, $repsoitory, $item->leadID, $item->newStatus, $item->comment);
      if ($result) {
        //если успешно, то удаляем amoBuf
        $result = $repsoitory->deleteAmoBufTask($item->_id);
        if ($result) {
          var_dump('task successfully done');
        }
      } else {
        //добавить логирование ошибки
        var_dump('failed');
      };
      break;
    case 2:
      //получаем инфу о лиде из crm и обновлем в таске
      $result = getLeadInfoFromAmoAndUpdateTask($amoClient, $repsoitory, $item->leadID, $item->taskID);
      if ($result) {
        //если успешно, то удаляем amoBuf
        $result = $repsoitory->deleteAmoBufTask($item->_id);
        if ($result) {
          var_dump('task successfully done');
        }
      } else {
        //добавить логирование ошибки
        var_dump('failed get info');
      };
      break;
  }
}

function addLead(LeadgenAmoClient $amoClient, string $phone, int $status, string $city, string $comment){
  $lead = $amoClient->addLeadToCrm($phone, $status, $city);
  $amoClient->addCommentToLead($lead, $comment);
  return true;
}

function updateLeadInfo(LeadgenAmoClient $amoClient, Repository $repsoitory, int $leadID, int $newStatus, string $comment) {
  $lead = $amoClient->getLeadById($leadID);
  if ($lead == null) {
    return false;
  }
  if ($newStatus) {
    $amoClient->updateLeadStatus($lead, $newStatus);
  }
  if ($comment){
    $amoClient->addCommentToLead($lead, $comment);
  }
  return true;
}

function getLeadInfoFromAmoAndUpdateTask(LeadgenAmoClient $amoClient, Repository $repsoitory, int $leadID, string $taskID){
  $task = $repsoitory->getTaskById($taskID);
  if ($task == null) {
    return false;
  }
  $lead = $amoClient->getLeadById($leadID);
  if ($lead == null) {
    return false;
  }
  $phone = $amoClient->getLeadsPhoneNumber($lead);
  $city = $amoClient->getLeadsCity($lead);
  if ($city==""){
    return false;
  }
  $task->phone = $phone;
  $task->cityName = $city;
  $result = $repsoitory->updateTask($task);
  return $result;
}