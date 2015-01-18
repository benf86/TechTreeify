var my_body = $('body').select().append('<div id=\'content\'></div>');
var get_tech_tree = function(tech_tree_name) {
    $.ajax({
        url: '/json/' + tech_tree_name,
        data: {},
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            print_tech_tree(json);
        },
        error: function (xhr, status, errorThrown) {
            alert('Sorry, there was a problem!');
            console.log('Error: ' + errorThrown);
            console.log('Status: ' + status);
            console.dir(xhr);
        },
        complete: function(xhr, status) {
            my_body.prepend('<p id=\'status\'></p>');
            $('#status').text('Request complete!');
        }
    });
};

var print_tech_tree = function(json) {
    for (item in json) {
        $('#content').select()
            .append('<div class=\'tech\'></div>');
        for (tech_data in json[item]) {
            $('.tech:last')
                .append('<div></div>');
            $('div:last')
                .attr("class", tech_data)
                .text(function() {
                    if (json[item][tech_data].constructor === Array) {
                        return json[item][tech_data].join(', ');
                    }
                    else {
                        return json[item][tech_data];
                    }
                });
        }
    }
};

get_tech_tree('LolNo');