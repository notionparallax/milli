var processInputs = function() {

    console.log("processing these inputs");

    //record if the Ts&Cs are ticked
    var t_c_checked = $("input[type='checkbox']").is(':checked');

    //replace line breaks with a ~| (because it'll basically never come up in prose)
    var tidyMessage = $("#messageBox").val().replace(/(\r\n|\n|\r)/gm, "~|");
    var tidyAddress = $("#addressBox").val().replace(/(\r\n|\n|\r)/gm, "~|");

    //slice up the message and address into 200 character chunks
    var messageChunks1 = tidyMessage.slice(0  , 200);
    var messageChunks2 = tidyMessage.slice(200, 400);
    var messageChunks3 = tidyMessage.slice(400, 600);
    var messageChunks4 = tidyMessage.slice(600, 800);

    var addressChunks1 = tidyAddress.slice(0  , 200);
    var addressChunks2 = tidyAddress.slice(200, 400);

    var messageWritten = true;
    var addressWritten = true;
    var tancTicked     = true;

    //put the 200 char chunks into the secret boxes
    $("#m1").val(messageChunks1);
    $("#m2").val(messageChunks2);
    $("#m3").val(messageChunks3);
    $("#m4").val(messageChunks4);

    $("#a1").val(addressChunks1);
    $("#a2").val(addressChunks2 + "agreed:" + t_c_checked);

    if (tidyMessage.length != 0 && // If there is an address
        tidyAddress.length != 0 && // and a message then
        t_c_checked) {             // and the box is ticked
                                   // then send data to paypal
        ga('send', 'event', 'success', 'click', 'all filled in!');
        return true;
    } else {
        //send an error report to GA
        ga('send', 'event', 'error', 'click',"not properly filled in");
        return false;
    }
};

var submit_email = function() {
    var myAddress = "ben+postednotes@notionparallax.co.uk";
    var theirAddress = $("#email").val();
    var theirName = $("#name").val();
    // console.log(["email button",   myAddress, theirAddress, theirName ]);
    if (theirAddress.length > 3 && theirName.length > 1) {
        $.ajax({
            type: "POST",
            url: "https://mandrillapp.com/api/1.0/messages/send.json",
            data: {
                'key': '92W7qrQShJKr0-pTYL10jQ',
                'message': {
                    'from_email': 'ben@notionparallax.co.uk',
                    'to': [{
                        'email': myAddress,
                        'name': 'RECIPIENT NAME (OPTIONAL)',
                        'type': 'to'
                    }],
                    'autotext': 'true',
                    'subject':   theirName + ' Just signed up for postednotes',
                    'html':      theirAddress
                }
            }
        }).done(function(response) {
            console.log(response); // if you're into that sorta thing
        });
        $(".message").html('<div class="alert alert-success" role="alert">Thanks! We&rsquo;ll be in touch.</div>');
        ga('send', 'event', 'success', 'click', 'email sign up');
    } else {
        $(".message").html('<div class="alert alert-warning" role="alert">Fill it in <em>before</em> you press send!</div>');
        ga('send', 'event', 'error', 'click', 'email sign up error');
    }
    return false;
};

console.log("hold on, I'm getting organised");
$(document).ready(function() {
    console.log("OK, I'm ready now");
    //declare things for analytics
    document.postedNotesOneOffEventFlags = new Object();
    document.postedNotesOneOffEventFlags.hasScrolled = false;
    document.postedNotesOneOffEventFlags.haswrittenSome_message = false;
    document.postedNotesOneOffEventFlags.haswrittenSome_address = false;

    $("#realButton").click(processInputs);

    $(window).bind("beforeunload", function() {
        //this sends a ga event when the window is closed.
        ga('send', 'event', 'close', JSON.stringify(document.postedNotesOneOffEventFlags));
    });

    $(document).focus();
});
