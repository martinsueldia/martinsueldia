sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
], function (Controller, History, Filter, FilterOperator, MessageToast) {
  "use strict";
  var oController;
  return Controller.extend("profertil.appCtaCorriente.controller.DetalleCreditoAcordada", {
    onInit: function () {
      // create the views based on the url/hash
      //this.getRouter().initialize();


      oController = this;
			oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);
    },

    _onRouteMatched: function(){
       var clienteA = this.getModel("ModelEstadoGral").getData().ModelEstadoGral.Kunnr;
      if (clienteA != this.clienteB){
        this.clienteB = clienteA;
        this.getView().byId("lineaAcordadaTabla").rebindTable();
      }
    },


    onBeforeRebindTable: function (oEvent) {
      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      oBindingParams.filters.push(new Filter("KUNNR", FilterOperator.EQ, cliente));
    },

    onChangeFechaSaldoCheques: function (oEvent) {
      this.getView().byId("lineaAcordadaTabla").rebindTable();
    },

    onNavBack: function () {
      var sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        history.go(-1);
      } else {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteMainView", {}, true);
      }
    },
    onBeforeExport: function (oEvent){
      oEvent.getParameter("exportSettings").worker = false;
    },
    onPdfDocumento: function (oEvent){
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      var rutaRecibo = this.getView().getModel().sServiceUrl;
      var año = oTabla.BUDAT.getUTCFullYear();
      // año = año.getFullYear();
      // eslint-disable-next-line camelcase
      var lv_path = rutaRecibo + "/pdfRecibosSet('PROF" + oTabla.BELNR + año  + oTabla.BLART+ "')/$value";
      $.get({
        // eslint-disable-next-line camelcase
        url: lv_path,
        success: function () {
          // eslint-disable-next-line no-unused-vars
          window.open(lv_path, "_blank");
        }
      }).fail(function () {
          MessageToast.show("Documento no encontrado");
      });
    },
    // changeDateToUTC: function(oDate){ //for sending dates to backend
    //   oDate = new Date(oDate.setHours("00","00","00","00"));
    //   // oDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (-60000));
    //   oDate = oDate.setDate(oDate.getDate() + 1);
    //   return oDate;
    // },
  });
});
