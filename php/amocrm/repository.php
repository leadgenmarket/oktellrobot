<?

class Repository{
  protected $db;
  function __construct(string $dsn) {
    $client = new MongoDB\Client("mongodb://".$dsn);
    $this->db = $client->leadgen;
  }

  function getAmoBuffList():Array {
    $result = $this->db->amoBuf->find(array(), ['limit' => 15])->toArray();
    return $result;
  }
  
  function getTaskById(string $taskID){
    $result = $this->db->tasks->findOne(["_id" => new MongoDB\BSON\ObjectID($taskID)]);
    //если таски нету, то возвращает null
    return $result;
  }
}