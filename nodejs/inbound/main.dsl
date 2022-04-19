import "commonReactions/all.dsl";
import "types.dsl";
context
{
    output positive_or_negative: boolean = false;
    output answered: boolean = false;
    output ask_call_later: boolean = false;
    output cityInfo: CityInfo = {inputs:[], name:""};
}

external function getCity(cityInfo: CityInfo): CityInfo;

start node root
{
    do
    {

        #connectSafe("");
        #say("hello");
        wait *;
    }
    transitions
    {
        greet: goto greet on true;
    }
}

node greet {
    do
    {
        #say("greet_simple");
        set $answered=true;
        wait *;
    }
    transitions
    {
        positive: goto succees on #messageHasSentiment("positive");
        negative: goto negative on #messageHasIntent("negative");
        who_are_you: goto who_are_you on #messageHasIntent("who_are_you");
        number_question: goto number_question on #messageHasIntent("number_question");
    } 
}

node who_are_you {
    do
    {
        
       
        #say("who_are_you");
        goto do_you_want_to_buy;
    }
    transitions
    {
        do_you_want_to_buy: goto do_you_want_to_buy;
    }
}

node number_question {
    do 
    {
        #say("number_question");
        wait *;
    }
    transitions
    {
        positive: goto succees on #messageHasSentiment("positive");
        negative: goto negative on #messageHasIntent("negative");
        who_are_you: goto who_are_you on #messageHasIntent("who_are_you");
    }
}

node do_you_want_to_buy {
    do
    {
        #say("do_you_want_to_buy");
        wait *;
    }
    transitions
    {
        positive: goto succees on #messageHasSentiment("positive");
        negative: goto negative on #messageHasIntent("negative");
        who_are_you: goto who_are_you on #messageHasIntent("who_are_you");
        number_question: goto number_question on #messageHasIntent("number_question");
    }
}

node succees
{
    do
    {
        set $positive_or_negative=true;
        #say("city_question");
        wait *;
        exit;
    }
    transitions
    {
        validate_city_name: goto validate_city_name on true;
    }
}

node validate_city_name{
    do
    {
        $cityInfo.inputs.push(#getMessageText().trim());
        set $cityInfo = external getCity({name:"", inputs: $cityInfo.inputs});
        //если кол-во попыток меньше 3 и город не распознан, то спрашиваем еще раз, иначе выходим
        #log($cityInfo.inputs.length());
        if ($cityInfo.name == "" && $cityInfo.inputs.length() < 3){
            goto ask_again;
        } else {
           #say("success");
           exit; 
        }
    }
    transitions
    {
        ask_again: goto dont_understand_city;
    }
}

node dont_understand_city {
    do
    {
        #say("dont_understand");
        wait *;
        exit;
    }
    transitions
    {
        validate_city_name: goto validate_city_name on true;
    }
}

node negative
{
     do
    {
        #say("sorry_wont_call");
        set $positive_or_negative=false;
        exit;
    }
    transitions
    {
    }
}