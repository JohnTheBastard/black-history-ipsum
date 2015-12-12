// Author object constructor
function AuthorObj( properties ) {

    this.unescapedConcat = function( paragraphArray ) {
	return paragraphArray
	        .map(function(a) {return "<p>" + a + "</p>";})
	        .reduce(function(a,b) {return a + b;});
    }

    this.escapedConcat = function( paragraphArray ) {
	return paragraphArray
	        .map(function(a) {return "<p>&lt;p&gt" + a + "&lt/p&gt</p>";})
	        .reduce(function(a,b) {return a + b;});
    }
    
    this.name = properties.name;
    this.shortName = properties.shortName;
    this.taggedText = this.escapedConcat(properties.paragraphs);
    this.untaggedText = this.unescapedConcat(properties.paragraphs);
    var self = this;
}

var GET_JSON = (function() {
    var my = {};
    my.authorData = {};
    my.jsonURL = "js/authorIpsum.json";
    var alphabetical = function(a, b) {
	var A = a.toLowerCase();
	var B = b.toLowerCase();
	
	if (A < B) {return -1; }
	else if (A > B) { return  1; }
	else { return 0; }
    }
    var byShortName = function(a, b) { return alphabetical( a.shortName, b.shortName ) };
    var castToAuthorObj = function(author) { return new AuthorObj(author); }
    var processJSON = function( jsonData, textStatus, xhr ) {
	my.authorData = jsonData.authors.map( castToAuthorObj ).sort(byShortName);
    }

    my.getAuthorData = function() {
	$.ajax( { type: "GET",
		  url: my.jsonURL,
		  async: false,
		  dataType: "json",
		  contentType: 'application/json; charset=utf-8',
		  success: processJSON } );
    }
    
    my.populateAuthorPullDown = function() {
	var $authorPulldown = $('#authorname');
	var $pulldownItems = my.authorData
	    .map(function(author){ return $('<option></option>').attr('value', author.shortName).append(author.name); });

	$authorPulldown.append($pulldownItems);
    }

    my.publish = function(properties) {
	var $ipsumAnchor = $('#generatedtext');
	$ipsumAnchor.empty();
	var authorForOutput = my.authorData.filter( function(author){ return author.shortName === properties.author; } )[0];
	var outputText = ""
	if (properties.pTags) {
	    outputText = authorForOutput.taggedText;
	} else {
	    outputText = authorForOutput.untaggedText;
	}
	var $outputText = $('<div></div>').html(outputText);
	$ipsumAnchor.append($outputText);
    }
    
    // This is where we begin doing stuff
    my.getAuthorData();
    my.populateAuthorPullDown();
    
    my.eventListeners = (function() {
	var $generate = $('#generate');
	$generate.on('click', function(event) {
	    event.preventDefault();
	    var values = {};
	    values.author = $('#authorname option:selected').attr("value");
	    //I'm commenting these out as I don't think it's actually a useful feature
	    //values.wordsOrParagraphs = $( "input:checked" ).val();
	    //values.ipsumLength = parseInt($('#ipsumLength').val());
	    values.pTags = $('#tagsCheckBox').is(':checked');
	    my.publish(values);
	});
    })();
    
    return my;
})();
