(function () {
    document.addEventListener("load", function(){
        var button = document.querySelectorAll("button[id='showcandles']")[0];
        button.addEventListener("mousedown", function() {
            console.log("clicked");
            var candlesbutton = document.getElementById("candles");
            if (candlesbutton) {
                var aml = document.getElementById("allmylinks");
                if (aml) {
                    aml.classList.add("hide");
                }
                candlesbutton.classList.remove("hide");
                AML.plot();
            }
          });
    });
})();