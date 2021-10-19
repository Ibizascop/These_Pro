function form() {
var form = FormApp.create('Images Form 4');
var ss = SpreadsheetApp.create('Images Form 4')

// Update form properties via chaining.
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


//1 réponse par ligne et par colonne
const gridValidation = FormApp.createGridValidation()
   .setHelpText("Please select one item per row and per column.")
   .requireLimitOneResponsePerColumn()
   .build();

//Disclaimer
var item = form.addMultipleChoiceItem();
item.setTitle('Do you consent to take part to this survey ?')
     .setRequired(true);

//Section_1
var Section_1 = form.addPageBreakItem()
  .setTitle('Image n°1')
item.setChoices([
  item.createChoice('Yes',FormApp.PageNavigationType.CONTINUE),
  item.createChoice('No',FormApp.PageNavigationType.SUBMIT)
  ]);

//Random Reference Image , Random similarity Rank and the 3 images at this rank
var reference_index = Math.floor(Math.random() * (json.length-1))

var reference_image_1 = DriveApp.getFilesByName(json[reference_index]["Name"]);
if (reference_image_1.hasNext()) {
    var blob_reference_1 = reference_image_1.next();
    Logger.log("Image n°1 = "+blob_reference_1)
    var blob_reference_1 = blob_reference_1.getBlob()
}
form.addImageItem().setImage(blob_reference_1).setWidth(512).setTitle('Reference Image 1');

var similarity_rank = Math.floor(Math.random() * (10))+1
Logger.log("Similarity rank n°1 = "+similarity_rank)
var img_1_1 = DriveApp.getFilesByName(json[reference_index]["TF_IDF"][similarity_rank]);
if (img_1_1.hasNext()) {
    var blob_1_1 = img_1_1.next();
    var blob_1_1 = blob_1_1.getBlob()
}
form.addImageItem().setImage(blob_1_1).setWidth(256).setTitle('Image 1_1');

var img_1_2 = DriveApp.getFilesByName(json[reference_index]["Color"][similarity_rank]);
if (img_1_2.hasNext()) {
    var blob_1_2 = img_1_2.next();
    var blob_1_2 = blob_1_2.getBlob()
}
form.addImageItem().setImage(blob_1_2).setWidth(256).setTitle('Image 1_2');

var img_1_3 = DriveApp.getFilesByName(json[reference_index]["CNN"][similarity_rank]);
if (img_1_3.hasNext()) {
    var blob_1_3 = img_1_3.next();
    var blob_1_3 = blob_1_3.getBlob()
}
form.addImageItem().setImage(blob_1_3).setWidth(256).setTitle('Image 1_3');

form.addGridItem()
    .setTitle('Please rank the 3 images by similarity to the reference Image (1)')
    .setRows(['Image 1_1', 'Image 1_2', 'Image 1_3'])
    .setColumns(['The most similar', 'In the middle', 'The less similar'])
    .setValidation(gridValidation);

form.addTextItem()
  .setTitle('Which aspect(s) of the images did you take in account to rank them ?');

var Section_2 = form.addPageBreakItem()
  .setTitle('Image n°2')
Section_1.setGoToPage(FormApp.PageNavigationType.CONTINUE);


//Random Reference Image , Random similarity Rank and the 3 images at this rank
var reference_index = Math.floor(Math.random() * (json.length-1))

var reference_image_2 = DriveApp.getFilesByName(json[reference_index]["Name"]);

if (reference_image_2.hasNext()) {
    var blob_reference_2 = reference_image_2.next();
    Logger.log("Image n°2 = "+blob_reference_2)
    var blob_reference_2 = blob_reference_2.getBlob()
}
var similarity_rank = Math.floor(Math.random() * (10))+1
Logger.log("Similarity rank n°2 = "+similarity_rank)

form.addImageItem().setImage(blob_reference_2).setWidth(512).setTitle('Reference Image 2');

var img_2_1 = DriveApp.getFilesByName(json[reference_index]["TF_IDF"][similarity_rank]);
if (img_2_1.hasNext()) {
    var blob_2_1 = img_2_1.next();
    var blob_2_1 = blob_2_1.getBlob()
}
form.addImageItem().setImage(blob_2_1).setWidth(256).setTitle('Image 2_1');

var img_2_2 = DriveApp.getFilesByName(json[reference_index]["Color"][similarity_rank]);
if (img_2_2.hasNext()) {
    var blob_2_2 = img_2_2.next();
    var blob_2_2 = blob_2_2.getBlob()
}
form.addImageItem().setImage(blob_2_2).setWidth(256).setTitle('Image 2_2');

var img_2_3 = DriveApp.getFilesByName(json[reference_index]["CNN"][similarity_rank]);
if (img_2_3.hasNext()) {
    var blob_2_3 = img_2_3.next();
    var blob_2_3 = blob_2_3.getBlob()
}
form.addImageItem().setImage(blob_2_3).setWidth(256).setTitle('Image 2_3');

form.addGridItem()
    .setTitle('Please rank the 3 images by similarity to the reference Image (2)')
    .setRows(['Image 2_1', 'Image 2_2', 'Image 2_3'])
    .setColumns(['The most similar', 'In the middle', 'The less similar'])
    .setValidation(gridValidation);

form.addTextItem()
  .setTitle('Which aspect(s) of the images did you take in account to rank them ?');

var Section_3 = form.addPageBreakItem()
  .setTitle('Image n°3')
Section_2.setGoToPage(FormApp.PageNavigationType.CONTINUE);

//Random Reference Image , Random similarity Rank and the 3 images at this rank
var reference_index = Math.floor(Math.random() * (json.length-1))

var reference_image_3 = DriveApp.getFilesByName(json[reference_index]["Name"]);

if (reference_image_3.hasNext()) {
    var blob_reference_3 = reference_image_3.next();
    Logger.log("Image n°3 = "+blob_reference_3)
    var blob_reference_3 = blob_reference_3.getBlob()
}
var similarity_rank = Math.floor(Math.random() * (10))+1
Logger.log("Similarity rank n°3 = "+similarity_rank)

form.addImageItem().setImage(blob_reference_3).setWidth(512).setTitle('Reference Image 3');

var img_3_1 = DriveApp.getFilesByName(json[reference_index]["TF_IDF"][similarity_rank]);
if (img_3_1.hasNext()) {
    var blob_3_1 = img_3_1.next();
    var blob_3_1 = blob_3_1.getBlob()
}
form.addImageItem().setImage(blob_3_1).setWidth(256).setTitle('Image 3_1');

var img_3_2 = DriveApp.getFilesByName(json[reference_index]["Color"][similarity_rank]);
if (img_3_2.hasNext()) {
    var blob_3_2 = img_3_2.next();
    var blob_3_2 = blob_3_2.getBlob()
}
form.addImageItem().setImage(blob_3_2).setWidth(256).setTitle('Image 3_2');

var img_3_3 = DriveApp.getFilesByName(json[reference_index]["CNN"][similarity_rank]);
if (img_3_3.hasNext()) {
    var blob_3_3 = img_3_3.next();
    var blob_3_3 = blob_3_3.getBlob()
}
form.addImageItem().setImage(blob_3_3).setWidth(256).setTitle('Image 3_3');

form.addGridItem()
    .setTitle('Please rank the 3 images by similarity to the reference Image (3)')
    .setRows(['Image 3_1', 'Image 3_2', 'Image 3_3'])
    .setColumns(['The most similar', 'In the middle', 'The less similar'])
    .setValidation(gridValidation);
form.addTextItem()
  .setTitle('Which aspect(s) of the images did you take in account to rank them ?');

Section_3.setGoToPage(FormApp.PageNavigationType.CONTINUE);

//Form url
Logger.log('Published URL: ' + form.getPublishedUrl());
Logger.log('Editor URL: ' + form.getEditUrl());
}

//Get submitted answers
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
