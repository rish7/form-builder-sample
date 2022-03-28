//Config data 
var NH_CONTROLLERS = {
    "NAME": { name: "Name", icon: "fa-user", preview: "<div class='previewInput previewInputName'><div class='innerArea'>NAME HERE</div></div>", height: 35, width: 200, isResizable: false },
    "ADDRESS": { name: "Address", icon: "fa-address-card", preview: "<div class='previewInput previewInputAddress'><b>Robert</b><div class='innerArea'>ADDRESS 1<div></div><div>ADDRESS 2</div><div>CITY</div><div>COUNTRY</div></div></div>", height: 150, width: 300, isResizable: false },
    "LABEL": { name: "Label", icon: "fa-i-cursor", preview: "<div class='previewInput previewInputLabel'><div class='innerArea'><b  class='tipForEdit'>Label (Click and Edit)</b></div></div>", editable: "<textarea width='100%'height='100%' class='previewEditNameInput' rows='1' placeholder='Please enter name'></textarea>", height: 35, width: 200, isResizable: true },
    "IMAGE": { name: "Image", icon: "fa-picture-o", preview: "<div class='previewInput previewInputImage'><div class='innerArea'><b class='tipForEdit'>Image (Click and Edit)</b><img src='assets/images/img-placeholder.png' alt='image'/></div></div>", editable: "<input type='file' class='previewEditNameInput' placeholder='Please enter Label Text'/>", height: 200, width: 200, isResizable: true }
}
var MIN_MARGIN = 10;

//Helps to hold current draggable input type
var currentDraggableInputType;


/**
 * Starting point of our code
 */
$(function () {
    loadControllers();

    $(".nh-controllerType").draggable({
        revert: "invalid",
        opacity: 0.7,
        helper: "clone",
        start: function () {
            currentDraggableInputType = $(this).attr("data-inputType");
        },
        drag: function () {
            //Later use
        },
        stop: function () {
            //Later use
        }
    });

    $("#designArea").droppable({
        classes: {
            "ui-droppable-active": "ui-state-active"
        },
        drop: function (event, ui) {
            if (currentDraggableInputType) {


                var currentElemtConfig = NH_CONTROLLERS[currentDraggableInputType];
                var htmlString = currentElemtConfig.preview;

                var newEleTop = ui.position.top - $(this).offset().top;
                var newEleLeft = ui.position.left - $(this).offset().left;

                var newEleHeight = currentElemtConfig.height;
                var newEleWidth = currentElemtConfig.width;


                var designAreaWidth = $(this).width();
                var designAreaHeight = $(this).height();

                //If new input is drag and drop out side adjust
                //TOP
                if(newEleTop < MIN_MARGIN){
                    newEleTop = MIN_MARGIN;
                } else if(newEleTop + newEleHeight > designAreaHeight){
                    newEleTop = designAreaHeight - newEleHeight - MIN_MARGIN;
                }

                //LEFT
                if(newEleLeft < MIN_MARGIN){
                    newEleLeft = MIN_MARGIN;
                }else if(newEleLeft + newEleWidth > designAreaWidth){
                    newEleLeft = designAreaWidth - newEleWidth - MIN_MARGIN;
                }
                
                var addInput = $(htmlString).css({
                    position: "absolute",
                    top: newEleTop,
                    left: newEleLeft,
                    height: newEleHeight,
                    width: newEleWidth
                });
                addInput.attr("data-inputType", currentDraggableInputType);
                addListenerToNewInputType(addInput, currentDraggableInputType);
                $(this).append(addInput);

                //Make current Draggable InputType to null. So user done with his job.
                currentDraggableInputType = null;
            }
        }
    });
    //To save template design info
    $("#saveTemplateDataBtn").on("click", function(){
        var inputsData = [];
        $("#designArea .previewInput").each(function(){
            inputsData.push({
                "name":$(this).attr("data-inputType"),
                "height":$(this).height(),
                "width":$(this).width(),
                "top":$(this).position().top,
                "left":$(this).position().left
            });
        })
        if(inputsData.length == 0){
            alert("No Inputs");
            return;
        }
        $("#templateData").val(JSON.stringify(inputsData, null, 5));
    });

     //To save template design info
    $("#insertTemplateDataBtn").on("click", function(){
        var data = $("#templateData").val();
        try{
            var inputs = JSON.parse(data);
            for(var i in inputs){
                    var currentInput = inputs[i];
                    addInputFromTemplate(currentInput);
            }

        }catch(e){
            alert("Invalid template data");
        }
    });

    //To open View model window
    $("#PreviewBtn").on("click", function(){
        var tempDivEle = $("<div></div>");
        $("#designArea .previewInput").each(function(){
            var input = $(NH_CONTROLLERS[$(this).attr("data-inputType")].preview);
            input.attr("style","position: absolute;height:"+$(this).height()+"px;width:"+$(this).width()+"px;top:"+parseInt($(this).position().top) +"px;left:"+parseInt($(this).position().left)+"px;")
            input.find('.tipForEdit').remove();
            tempDivEle.append(input);
        });
        $("#designAreaPreview").html(tempDivEle.html());
        tempDivEle = null;
        $("#designAreaPreviewModal").css("display","block");
    });
    $("#designAreaPreviewCloseBtn").on("click", function(){
        $("#designAreaPreviewModal").css("display","none");
    });
});

/**
 * 
 * Add new element from template
 * @param {any} input 
 */
function addInputFromTemplate(input){
    var currentElemtConfig = NH_CONTROLLERS[input.name];
    var htmlString = currentElemtConfig.preview;
    var addInput = $(htmlString).css({
        position: "absolute",
        top: input.top,
        left: input.left,
        height: input.height,
        width: input.width
    });
    addInput.attr("data-inputType", input.name);
    addListenerToNewInputType(addInput, input.name);
    $("#designArea").append(addInput);
}

/**
 * 
 * Add event list
 * @param {any} newInput 
 */
function addListenerToNewInputType(newInput, inputType) {

    if (inputType) {
        var closeButton = $("<span class='fa fa-times-circle inputTypeCloseButton'></span>");
        newInput.append(closeButton);
        closeButton.on("click", function () {
            var result = confirm("Are sure you want to delete this?");
            if (result == true) {
                $(this).parent().remove();
            }
        });
        
        newInput.draggable({
            containment: "#designArea", scroll: true,
            start: function () {
                currentDraggableInputType = null;
            },
            drag: function () {
                //Later use
            },
            stop: function () {
                //Later use
            }
        });
        //Make resizable, if so
        var currentElemtConfig = NH_CONTROLLERS[inputType];
        if (currentElemtConfig.isResizable) {
            newInput.resizable({
                containment: "#designArea"
            });
        }

        //If no editable no need to add click event also
        if (currentElemtConfig.editable) {
            newInput.on("click", function () {
                //if it in edit mode?
                if (!$(this).hasClass("previewInput_OnEditMode")) {
                    var inputType = $(this).attr("data-inputType");
                    $(this).children(".innerArea:first").html(NH_CONTROLLERS[inputType].editable);
                    $(this).addClass("previewInput_OnEditMode");
                }
            })
        }
    }
}



/**
 * Here we will sections input elements (placeholders and etc..)
 * 
 */
function loadControllers() {
    //TODO: NH_CONTROLLERS - Later it will come from Config file
    var elements = "";

    //Loading Section 1 elements
    for (var key in NH_CONTROLLERS) {
        elements += '<div id="input_' + NH_CONTROLLERS[key].name.replace(" ", "_") + '_Type" class="ui-widget-content nh-controllerType" data-inputType=' + key + '><spam class="fa ' + NH_CONTROLLERS[key].icon + '" aria-hidden="true"></span>&nbsp;' + NH_CONTROLLERS[key].name + '</div>';
    }
    $("#section1Wrapper").html(elements);

    //Loading Section 2 elements --For now same elements repeated here also
    elements = "";
    for (var key in NH_CONTROLLERS) {
        elements += '<div id="input_' + NH_CONTROLLERS[key].name.replace(" ", "_") + '_Type" class="ui-widget-content nh-controllerType" data-inputType=' + key + '><spam class="fa ' + NH_CONTROLLERS[key].icon + '" aria-hidden="true"></span>&nbsp;' + NH_CONTROLLERS[key].name + '</div>';
    }
    $("#section2Wrapper").html(elements);

    $("#controllersAccordion").accordion();
}


function download() {
    var a = document.body.appendChild(
        document.createElement("a")
    );
    a.download = "export.html";
    a.href = "data:text/html," + document.getElementById("designArea").innerHTML; // Grab the HTML
    a.click(); // Trigger a click on the element
}
