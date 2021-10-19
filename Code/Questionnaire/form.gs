//This function create a 3 question form
//Each question is built the same way
//A random image is chosen and 3 images which have the same similary rank
//compared to the reference image based on the 3 different methods of calcul are taken
function form() {
var form = FormApp.create('Image form');
var ss = SpreadsheetApp.create('Image form')

// Title, Description and Confirmation Message
form.setTitle('Image distances metrics comparison')
    .setDescription('This form aims at quantifying the relevance of different image ranking metrics.                Distances between 3000 images were computed using 3 different methods : TF-IDF using images key-words, Color histograms and CNN feature extraction.                                                                           There are 3 questions, each built in the same way : There is a reference image and 3 other images. These 3 images have been given the same similarity rank using the 3 methods above.                                                                                                            The goal is now to estimate the relevence of each method on a random subset of images. For each question, the objective is to indicate which of the 3 images is more similar to the reference one, which is less similar... and, if possible, the reason of your ranking.                                                                                                                                  Thanks in advance for answering this form')
    .setConfirmationMessage('Thanks for responding!');

//Form responses destination
form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId())

//Get the images from the folder
const folderId = '1WdotUBxUGvnanInQ6XXSkYnc2Mh0LxYj'
const folder = DriveApp.getFolderById(folderId)
const images = folder.getFiles()

const all_images = []
while (images.hasNext()){
  image = images.next();
  all_images.push(image.getId())
}

//Json File that contains the similarity based ranking of all images
var file_number = Math.floor(Math.random() * (20-1))
var ranking_file_name = "Ranking_"+file_number+".json";
var rankings = DriveApp.getFilesByName(ranking_file_name);
if (rankings.hasNext()) {
  var ranking = rankings.next();
  var content = ranking.getBlob().getDataAsString();
  var json = JSON.parse(content);
}


//Force 1 réponse par ligne et par colonne
const gridValidation = FormApp.createGridValidation()
   .setHelpText("Please select one item per row and per column.")
   .requireLimitOneResponsePerColumn()
   .build();

//Disclaimer message
var item = form.addMultipleChoiceItem();
item.setTitle('Do you consent to take part to this survey ?')
     .setRequired(true);

//Create the page for the first question
var Section_1 = form.addPageBreakItem()
  .setTitle('Image n°1')
item.setChoices([
  item.createChoice('Yes',FormApp.PageNavigationType.CONTINUE),
  item.createChoice('No',FormApp.PageNavigationType.SUBMIT)
  ]);


//Loop 3 times to create the form
for (var i=1; i<4; i++) {
  //Random Reference Image , Random similarity Rank and the 3 images at this rank
  //Reference image
  var reference_index = Math.floor(Math.random() * (json.length-1))

  var reference_image = DriveApp.getFilesByName(json[reference_index]["Name"]);
  if (reference_image.hasNext()) {
      var blob_reference = reference_image.next();
      Logger.log("Image n°"+ i +" = "+blob_reference)
      var blob_reference = blob_reference.getBlob()
  }
  form.addImageItem().setImage(blob_reference).setWidth(512).setTitle('Reference Image '+i);

  //Similarity rank
  var similarity_rank = Math.floor(Math.random() * (10))+1
  Logger.log("Similarity rank n°"+ i +" = "+ similarity_rank)

  //Add the 3 images that have the same similarity rank with the reference image
  var img_1 = DriveApp.getFilesByName(json[reference_index]["TF_IDF"][similarity_rank]);
  if (img_1.hasNext()) {
      var blob_1 = img_1.next();
      var blob_1 = blob_1.getBlob()
  }
  form.addImageItem().setImage(blob_1).setWidth(256).setTitle('Image '+i+'_1');

  var img_2 = DriveApp.getFilesByName(json[reference_index]["Color"][similarity_rank]);
  if (img_2.hasNext()) {
      var blob_2 = img_2.next();
      var blob_2 = blob_2.getBlob()
  }
  form.addImageItem().setImage(blob_2).setWidth(256).setTitle('Image '+i+'_2');

  var img_3 = DriveApp.getFilesByName(json[reference_index]["CNN"][similarity_rank]);
  if (img_3.hasNext()) {
      var blob_3 = img_3.next();
      var blob_3 = blob_3.getBlob()
  }
  form.addImageItem().setImage(blob_3).setWidth(256).setTitle('Image '+i+'_3');

  //Grid item question where people can rank the images in similarity
  form.addGridItem()
      .setTitle('Please rank the 3 images by similarity to the reference Image ('+i+')')
      .setRows(['Image '+i+'_1', 'Image '+i+'_2', 'Image '+i+'_3'])
      .setColumns(['The most similar', 'In the middle', 'The less similar'])
      .setValidation(gridValidation);
  //Let people explain the reasons behind their ranking
  form.addTextItem()
    .setTitle('Which aspect(s) of the images did you take in account to rank them ?');

  //If end of question n°1; go to question n°2
  if (i == 1) {
    var Section_2 = form.addPageBreakItem()
    .setTitle('Question n°2')
    Section_1.setGoToPage(FormApp.PageNavigationType.CONTINUE);
  }
  //If end of question n°2; go to question n°3
  else if (i == 2) {
    var Section_3 = form.addPageBreakItem()
      .setTitle('Question n°3')
    Section_2.setGoToPage(FormApp.PageNavigationType.CONTINUE);
  }
  //If end of question n°3; submit the form
  else if (i == 3) {
    Section_3.setGoToPage(FormApp.PageNavigationType.CONTINUE);
  }

}

//Get form url and edition url
Logger.log('Published URL: ' + form.getPublishedUrl());
Logger.log('Editor URL: ' + form.getEditUrl());
}

//Get submitted answers on a spreasheet 
function onFormSubmit3(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();

  for (var i=0; i<itemResponses.length; i++) {
    switch (itemResponses[i].getItem().getTitle()) {
      case "Rank the 3 images by similarity to the reference Image (1)":
        var rep_1 = itemResponses[i].getResponse();  // returns a string
        break;
      case "Rank the 3 images by similarity to the reference Image (2)":
        var rep_2 = itemResponses[i].getResponse();
        break;
      case "Rank the 3 images by similarity to the reference Image (3)":
        var rep_3 = itemResponses[i].getResponse();
        break;
    }
  }
}
