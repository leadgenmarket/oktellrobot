import "commonReactions/all.dsl";

context
{
    input phone: string;
}

start node root
{
    do
    {
        #connectSafe($phone);
        #waitForSpeech(1000);
        #sayText("Здравствуйте, это портал новостроек, вы хотите приобрести квартиру?");
        wait *;
    }
    transitions
    {
        want_to_buy: goto want_to_buy on #messageHasSentiment("positive");
        dont_want_to_buy: goto dont_want_to_buy on #messageHasSentiment("negative");
    }
}

node want_to_buy
{
    do
    {
        #sayText("Хорошо, отлично. Я передам менеджеру, он вам перезвонит.");
        exit;
    }
    transitions
    {
    }
}



node dont_want_to_buy
{
    do
    {
        #sayText("Спасибо, всего доброго.");
        exit;
    }
    transitions
    {
    }
}

