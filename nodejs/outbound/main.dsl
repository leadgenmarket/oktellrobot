import "commonReactions/all.dsl";
import "types.dsl";
context
{
    input phone: string;
    input city: string;
    output positive_or_negative: boolean = false;
    output answered: boolean = false;
    output ask_call_later: boolean = false;
}

external function getCity(cityInfo: CityInfo): CityInfo;

start node root
{
    do
    {
        #connectSafe($phone);
        #waitForSpeech(1000);
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
        if ($city == "новосибирск") {
            #say("greeting_nsk");
        } else if ($city == "санкт-петербург") {
            #say("greeting_spb");
        } else if ($city == "ростов-на-дону") {
            #say("greeting_rnd");
        } else {
            #say("greeting_msk");
        }
        set $answered=true;
        wait *;
    }
    transitions
    {
        positive: goto succees on #messageHasSentiment("positive");
        negative: goto negative on #messageHasSentiment("negative");
        who_are_you: goto who_are_you on #messageHasIntent("who_are_you");
        number_question: goto number_question on #messageHasIntent("number_question");
    } 
}

node who_are_you {
    do
    {
        
        if ($city == "новосибирск") {
            #say("who_are_you_nsk");
        } else if ($city == "санкт-петербург") {
            #say("who_are_you_spb");
        } else if ($city == "ростов-на-дону") {
            #say("who_are_you_rnd");
        } else {
            #say("who_are_you_msk");
        }
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
        negative: goto negative on #messageHasSentiment("negative");
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
        negative: goto negative on #messageHasSentiment("negative");
        who_are_you: goto who_are_you on #messageHasIntent("who_are_you");
        number_question: goto number_question on #messageHasIntent("number_question");
    }
}

node succees
{
    do
    {
        
        set $positive_or_negative=true;
        //если исходящий, то говорим спасибо и выходим
        #say("success");
        exit;
    }
    transitions
    {
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