function form() {
var form = FormApp.create('New Form');
var ss = SpreadsheetApp.create('Images Form 1')
form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId())

//Get the images from the folder
const folderId = '1gb0S3by6Dy64IKsg5AY4tpjNjhRORWc2'
const folder = DriveApp.getFolderById(folderId)
const images = folder.getFiles()

const all_images = []
while (images.hasNext()){
  image = images.next();
  all_images.push(image.getId())
}

//Json File that contains the similarity based ranking of all images
function getFileContent() {
  var ranking_file_name = "coliving2.json";
  var rankings = DriveApp.getFilesByName(ranking_file_name);
  if (rankings.hasNext()) {
    var ranking = rankings.next();
    var content = ranking.getBlob().getDataAsString();
    var json = JSON.parse(content);
  }
}


//Function to create the questions
function main_question(form) {
  //Random Reference Image , Random similarity Rank and the 3 images at this rank
  var reference_index = Math.floor(Math.random() * (all_images.length-1))
  var similarity_rank = Math.floor(Math.random() * (all_images.length-2))

  var reference_image = DriveApp.getFileByName(json[reference_index]["Name"]);
  var blob_reference = reference_image.getBlob();
  form.addImageItem().setImage(blob_reference).setWidth(512).setTitle('Reference Image');

  //The 3 comparison Images
  var img_1 = DriveApp.getFileByName(json[reference_index]["Rank "+String(similarity_rank)][0]);
  var blob_1 = img_1_1.getBlob();
  form.addImageItem().setImage(blob_1_1).setWidth(256).setTitle('Image 1_1');

  var img_2 = DriveApp.getFileByName(json[reference_index]["Rank "+String(similarity_rank)][1]);
  var blob_2 = img_1_2.getBlob();
  form.addImageItem().setImage(blob_1_2).setWidth(256).setTitle('Image 1_2');

  var img_3 = DriveApp.getFileByName(json[reference_index]["Rank "+String(similarity_rank)][2]);
  var blob_3 = img_1_3.getBlob();
  form.addImageItem().setImage(blob_1_3).setWidth(256).setTitle('Image 1_3');

  //Grid item // question
  form.addGridItem()
    .setTitle('Please rank the 3 images by similarity to the reference Image')
    .setRows(['Image 1', 'Image 2', 'Image 3'])
    .setColumns(['The most similar', 'In the middle', 'The less similar'])
    .setValidation(gridValidation);

  form.addTextItem()
    .setTitle('Which aspect(s) of the images did you take in account to rank them ?');
  }
}

//1 réponse par ligne et par colonne
const gridValidation = FormApp.createGridValidation()
   .setHelpText("Please select one item per row and per column.")
   .requireLimitOneResponsePerColumn()
   .build();

//Disclaimer
var item = form.addMultipleChoiceItem();
item.setTitle('XXX')
     .setRequired(true);

//Section_1
var Section_1 = form.addPageBreakItem()
  .setTitle('Image n°1')
item.setChoices([
  item.createChoice('Yes',FormApp.PageNavigationType.CONTINUE),
  item.createChoice('No',FormApp.PageNavigationType.SUBMIT)
  ]);

//Random Reference Image , Random similarity Rank and the 3 images at this rank
var form = main_question(form)
var Section_2 = form.addPageBreakItem()
  .setTitle('Image n°2')
Section_1.setGoToPage(FormApp.PageNavigationType.CONTINUE);


//Random Reference Image , Random similarity Rank and the 3 images at this rank
var form = main_question(form)
var Section_3 = form.addPageBreakItem()
  .setTitle('Image n°3')
Section_2.setGoToPage(FormApp.PageNavigationType.CONTINUE);

//Random Reference Image , Random similarity Rank and the 3 images at this rank
var form = main_question(form)
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
