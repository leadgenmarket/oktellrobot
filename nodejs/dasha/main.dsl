import "commonReactions/all.dsl";
context
{
    input phone: string;
    input city: string;
    text: string?;
    positive_or_negative: boolean = false;
}

start node root
{
    do
    {
        #connectSafe($phone);
        #waitForSpeech(1000);
        if ($city == "Новоссибирск") {
            #say("greeting_nsk");
        } else if ($city == "Санкт-Петербург") {
            #say("greeting_spb");
        } else if ($city == "Ростов-на-Дону") {
            #say("greeting_rnd");
        } else {
            #say("greeting_msk");
        }
        wait *;
    }
    transitions
    {
        who_are_you: goto who_are_you on #messageHasIntent("who_are_you");
        positive: goto succees on #messageHasSentiment("positive");
        negative: goto negative on #messageHasSentiment("negative");
    }
}

node who_are_you {
    do
    {
        if ($city == "Новоссибирск") {
            #say("who_are_you_nsk");
        } else if ($city == "Санкт-Петербург") {
            #say("who_are_you_spb");
        } else if ($city == "Ростов-на-Дону") {
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
    }
}

node succees
{
    do
    {
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
        exit;
    }
    transitions
    {
    }
}