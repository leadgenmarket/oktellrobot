<?
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
