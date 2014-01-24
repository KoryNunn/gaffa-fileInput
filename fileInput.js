var Gaffa = require('gaffa'),
    crel = require('crel'),
    doc = require('doc-js');

function setValue(event){
    var input = event.target,
        viewModel = input.parentElement.viewModel,
        files = Array.prototype.slice.call(input.files);

    for (var i = files.length - 1; i >= 0; i--) {
        var file = files[i];
        if(viewModel.maxSize.value && file.size / 1024 / 1024 > viewModel.maxSize.value){
            window.teabag(file.name + ' is too large to upload. The maximum file size accepted is ' + viewModel.maxSize.value + 'MB', 'alert', true);
            files.splice(i,1);
            i--;
        }
    };

    viewModel.files.set(files);
    viewModel.inputElement.value = null;
}

function FileInput(){}
FileInput = Gaffa.createSpec(FileInput, Gaffa.View);
FileInput.prototype.type = 'fileInput';
FileInput.prototype.render = function(){
    var input,
        renderedElement = crel('span', {'class':'fileInput'},
            input = crel('input', {'type':'file'}),
            crel('span', {'class':'icon-upload'}),
            crel('label', {'class':'fileInputLabel'})
        );

    doc.on("change", input, setValue);

    this.inputElement = input;

    this.renderedElement = renderedElement;

    this.__super__.render.apply(this, arguments);
};
FileInput.prototype.multiple = new Gaffa.Property(function(viewModel, value){
    var input = doc.find(viewModel.renderedElement, 'input')[0];
    if (value){
        input.setAttribute('multiple', null);
    }else{
        input.removeAttribute('multiple');
    }
});
FileInput.prototype.files = new Gaffa.Property();
FileInput.prototype.maxSize = new Gaffa.Property();
FileInput.prototype.accept = new Gaffa.Property(function(viewModel, value){
    var input = doc.find(viewModel.renderedElement, 'input')[0];
    if (value){
        input.setAttribute('accept', value);
    }else{
        input.removeAttribute('accept');
    }
});
FileInput.prototype.enabled = new Gaffa.Property({
    update: function(viewModel, value){
        var input = viewModel.inputElement;
        if (!value){
            input.setAttribute('disabled', 'disabled');
        }else{
            input.removeAttribute('disabled');
        }
    },
    value: true
});
FileInput.prototype.text = new Gaffa.Property(function(viewModel, value){
    doc.find(viewModel.renderedElement, 'label')[0].textContent = value ? value : '';
});

module.exports = FileInput;
