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

$repsoitory = new Repository($_ENV["APP_DSN"]);
$amoClient = new LeadgenAmoClient($baseDomain, $clientId, $clientSecret, $redirectUri);
$lead = $amoClient->getLeadById(29201257);

$amoBufList = $repsoitory->getAmoBuffList();

foreach($amoBufList as $item) {
  //типы заданий amobuf
  echo"<pre>";var_dump($item);echo"</pre>";
  switch ($item->type) {
    case 0:
      //добавляем лид
      break;
    case 1: 
      //обновляем лид
      break;
    case 2:
      //получаем инфу о лиде из crm и обновлем в таске
      break;
  }
}

function getLeadInfoFromAmoAndUpdateTask(int $leadID, string $taskID){
  $task = $repsoitory->getTaskById($item->taskID);
  if ($task != null) {
    echo"<pre>";var_dump($task);echo"</pre>";
  } else {
    //нету таски, можно удалить задание amoBuf
  }
}

/*
//$lead = $amoClient->getLeadById(29201257);
//var_dump($amoClient->getLeadsPhoneNumber($lead));
//var_dump($amoClient->getLeadsOfPipelineInStatus(2010945, 29589345));
