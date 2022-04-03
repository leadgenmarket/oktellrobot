<?

class Repository{
  protected $db;
  function __construct(string $dsn) {
    $client = new MongoDB\Client("mongodb://".$dsn);
    $this->db = $client->leadgen;
  }

  function getAmoBuffList(int $limit):Array {
    $result = $this->db->amoBuf->find(array(), ['limit' => $limit])->toArray();
    return $result;
  }

  function deleteAmoBufTask(MongoDB\BSON\ObjectID $id) {
    $result = $this->db->amoBuf->deleteOne(['_id' => $id]);
    if ($result->getDeletedCount() == 0){
      return false;
    }
    return true;
  }
  
  function getTaskById(string $taskID){
    $result = $this->db->tasks->findOne(["_id" => new MongoDB\BSON\ObjectID($taskID)]);
    //если таски нету, то возвращает null
    return $result;
  }

  function updateTask($task){
    $result = $this->db->tasks->updateOne(['_id' => $task['_id']], ['$set' => $task], ['upsert' => true]);
    if ($result->getMatchedCount()==0){
      return false;
    }
    return true;
  }
}