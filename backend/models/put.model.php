<?php

    require_once "connection.php";
    require_once "get.model.php";
    
    class PutModel{

        //petición PUT para editar datos de forma dinámica

        static public function putData($table, $data,$id,$nameId){
            
            //Validar el id;
            $response = GetModel::getDataFilter($table,$nameId,$nameId,$id, null,null,null,null);
            if(empty($response)){
                $response = array(
                    'comment' => "Error: The id is not found in database."
                );
                return $response;
            }

            //actualizamos registros
            
            $set = "";

    
            foreach ($data as $key => $value) {
                $set .= $key." = :".$key.",";
            }

            $set = substr($set, 0, -1);

            $sql= "UPDATE $table SET $set WHERE $nameId = :$nameId" ;

            $link = Connection::connect();
            $stmt = $link->prepare($sql);

            foreach ($data as $key => $value){
                $stmt-> bindParam(":".$key,$data[$key], PDO::PARAM_STR);
            }

            $stmt-> bindParam(":".$nameId, $id, PDO::PARAM_STR);
            

            if($stmt -> execute()){
                $response = array(
                    'comment' => "The process was successful"
                );
                return $response;
            }else{
                return $link->errorInfo();
            }
        }
}

?>