sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast"
], function (Controller, History, Filter, FilterOperator, Fragment, MessageToast) {
  "use strict";
  var oController;
  return Controller.extend("profertil.appCtaCorriente.controller.DetalleCanje", {
    onInit: function () {
      // create the views based on the url/hash
      //this.getRouter().initialize();

      oController = this;
			oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);
    },

    _onRouteMatched: function(){
      this.getView().byId("detalleCanje").rebindTable();
    },


    onPressNegocio: function (oEvent) {
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      this.Contrato = oTabla.Contrato;
      if (!this._oValueHelpDialogA) {
        Fragment.load({
          name: "profertil.appCtaCorriente.fragments.detalleDocumentos",
          controller: this
        }).then(function (oValueHelpDialog) {
          this._oValueHelpDialogA = oValueHelpDialog;
          this.getView().addDependent(this._oValueHelpDialogA);
          this._oValueHelpDialogA.open();
          this.filtrarDocumentos();
        }.bind(this));

      } else {
        this._oValueHelpDialogA.open();
        this.filtrarDocumentos();
      }
    },

    onPdfDocumento: function (oEvent) {
      var oModel = this.getView().getModel("relatedDocs");
      var ruta = oModel.sServiceUrl;
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      var sPath = ruta + "/PrinterSet(TipoDoc='CON',Documento='" + oTabla.Contrato + "')/$value";
      var o = window.open(sPath, "_blank");
      if (o == null) {
        MessageToast.show("Ducumento no encontrado");
      }
    },

    onPressEntregas: function (oEvent) {

      var oModel = this.getView().getModel("relatedDocs");
      var ruta = oModel.sServiceUrl;
      var oTabla = oEvent.getSource().getBindingContext().getObject();

      var sPath = ruta + "/PrinterSet(TipoDoc='REM',Documento='" + oTabla.belnr + "')/$value";
      var o = window.open(sPath, "_blank");
      if (o == null) {
        MessageToast.show("Ducumento no encontrado");
      }
    },

    filtrarDocumentos: function () {
      sap.ui.getCore().byId("detalleDocs").rebindTable();
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

    onBeforeRebindTable: function (oEvent) {
      var date = this.getView().byId("DP1").getDateValue();

      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      if (date) {
        oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, date));
      }

      oBindingParams.filters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));
    },
    onBeforeRebindTableDocs: function (oEvent) {
      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      oBindingParams.filters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));

      oBindingParams.filters.push(new Filter("Contrato", FilterOperator.EQ, this.Contrato));
    },

    onCancelarDcumentos: function () {
      this._oValueHelpDialogA.close();
    },

    onChangeFechaSaldoCereal: function (oEvent) {
      this.getView().byId("detalleCanje").rebindTable();
    },
  });
});

