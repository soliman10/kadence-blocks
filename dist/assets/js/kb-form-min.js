jQuery((function(r){if("undefined"==typeof kadence_blocks_form_params)return!1;var e={init:function(){r("form.kb-form").on("submit",this.submit)},submit:function(a){a.preventDefault();var o=r(this),i=o.find("input[type=submit]");form_data=e.validateForm(o),console.log(form_data),form_data&&(o.parent(".wp-block-kadence-form").find(".kadence-blocks-form-message").slideUp("fast",(function(){r(this).remove()})),o.append('<div class="kb-form-loading"><div class="kb-form-loading-spin"><div></div><div></div><div></div><div></div></div></div>'),i.attr("disabled","disabled").addClass("button-primary-disabled"),r.post(kadence_blocks_form_params.ajaxurl,form_data,(function(a){a.success?(r("body").trigger("kb-form-success",a),a.redirect?window.location=a.redirect:(o.after(a.html),e.clearForm(o))):(o.find(".g-recaptcha").length>0&&grecaptcha.reset(),o.after(a.data.html),a.data.required&&o.find("#"+a.data.required).length>0&&e.markError(o.find("#"+a.data.required),"required"),console.log(a.data.console),i.removeAttr("disabled")),i.removeClass("button-primary-disabled"),o.find(".kb-form-loading").remove()})))},removeErrors:function(e){r(e).parents(".kb-form").removeClass("kb-form-has-error"),r(e).find(".has-error").removeClass("has-error"),r(".kb-form-error-msg").remove()},isValidEmail:function(r){return new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i).test(r)},removeErrorNotice:function(e){r(e).find(".kb-form-errors").remove()},markError:function(e,a){var o="";if(r(e).parents(".kb-form").addClass("kb-form-has-error"),r(e).addClass("has-error"),a){switch(""!==(o=r(e).data("label"))&&void 0!==o||(o=kadence_blocks_form_params.item),a){case"required":case"mismatch":case"validation":o=o+" "+kadence_blocks_form_params[a]}r(e).siblings(".kb-form-error-msg").remove(),r(e).hasClass("kb-checkbox-style")?r(e).parent(".kadence-blocks-form-field").append('<div class="kb-form-error-msg kadence-blocks-form-warning">'+o+"</div>"):r(e).after('<div class="kb-form-error-msg kadence-blocks-form-warning">'+o+"</div>")}r(e).focus()},clearForm:function(e){r(e)[0].reset()},addErrorNotice:function(e){r(e).find("li.kb-form-submit").append('<div class="kb-form-errors">'+kadence_blocks_form_params.error_message+"</div>")},isValidURL:function(r){return new RegExp("^(http://www.|https://www.|ftp://www.|www.|http://|https://){1}([0-9A-Za-z]+.)").test(r)},isValidTel:function(r){return new RegExp("/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im").test(r)},validateForm:function(a){var o=!1;if(error_type="",e.removeErrors(a),e.removeErrorNotice(a),a.find('[data-required="yes"]:visible').each((function(a,i){switch(t="",r(i).data("type")){case"textarea":case"text":case"tel":""===(t=r.trim(r(i).val()))&&(o=!0,error_type="required",e.markError(i,error_type));break;case"accept":0==r(i).prop("checked")&&(o=!0,error_type="required",e.markError(i,error_type));break;case"select":t=r(i).val(),r(i).prop("multiple")?null!==t&&0!==t.length||(o=!0,error_type="required",e.markError(i,error_type)):t&&"-1"!==t||(o=!0,error_type="required",e.markError(i,error_type));break;case"radio":case"checkbox":r(i).find("input:checked").length||(o=!0,error_type="required",e.markError(i,error_type));break;case"email":""!==(t=r(i).val())?e.isValidEmail(t)||(o=!0,error_type="validation",e.markError(i,error_type)):""===t&&(o=!0,error_type="required",e.markError(i,error_type));break;case"url":var t;""!==(t=r(i).val())&&(e.isValidURL(t)||(o=!0,error_type="validation",e.markError(i,error_type)))}})),o)return e.addErrorNotice(a),!1;var i=a.serialize();return i=i+"&_kb_form_verify="+kadence_blocks_form_params.nonce}};e.init()}));