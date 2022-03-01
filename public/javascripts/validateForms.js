//* VIDEO 488 SERVING STATIC ASSETS
//* Moved bootstrap function from boilerplate.ejs - makes sense to group in public directory because its client side form validation

//* Created public directory
//*   Created public directory sub-folder javascripts & stylesheets
//* Added to app.js access to public directory app.use(express.static(path.join(__dirname, "public")));

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.getElementsByClassName("validated-form");
      // Loop over them and prevent submission
      const validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();
