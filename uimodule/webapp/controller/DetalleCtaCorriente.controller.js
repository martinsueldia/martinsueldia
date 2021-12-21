sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/format/DateFormat"
], function (Controller, History, Filter, FilterOperator, MessageToast, MessageBox, JSONModel) {
  "use strict";
  var oController;
  var saldoAcumulado;
  var fechaSaldo;
  return Controller.extend("profertil.appCtaCorriente.controller.DetalleCtaCorriente", {
    onInit: function () {
      var oViewModel;
      saldoAcumulado = false;
      oController = this;
      oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);

      oViewModel = new JSONModel({
        showBotonSaldo: false,
        toggleButton: false
      });
      this.setModel(oViewModel, "ctaView");
    },

    _onRouteMatched: function () {
       var clienteA = this.getModel("ModelEstadoGral").getData().ModelEstadoGral.Kunnr;
      if (clienteA != this.clienteB){
        this.clienteB = clienteA;
        this.getView().byId("detalleCtaCorrTabla").rebindTable();
      }
    },

    onChangeDateSaldo: function(){
      var saldo = this.getView().byId("DP1");
      var myDate = new Date();
      var hacedosaños = myDate.setFullYear(myDate.getFullYear() - 2);
      var oViewModel = this.getModel("oModelCliente");

      if (!(oViewModel.getProperty("/isAdmin"))){
      if (saldo.getDateValue() < hacedosaños){
        MessageBox.warning("La fecha seleccionada no tiene que superar los dos años");
        saldo.setValue("");
      }
    }
    },
    onChangeDateDesde: function(){
      var movimientoD = this.getView().byId("FechaDesdeID");
      var myDate = new Date();
      var hacedosaños = myDate.setFullYear(myDate.getFullYear() - 2);
      var oViewModel = this.getModel("oModelCliente");

      if (!(oViewModel.getProperty("/isAdmin"))){
      if (movimientoD.getDateValue() < hacedosaños){
        MessageBox.warning("La fecha seleccionada no tiene que superar los dos años");
        movimientoD.setValue("");
      }
    }
    },
    onChangeDateHasta: function(){
      var movimientoH = this.getView().byId("FechaHastaID");
      var myDate = new Date();
      var hacedosaños = myDate.setFullYear(myDate.getFullYear() - 2);
      var oViewModel = this.getModel("oModelCliente");

      if (!(oViewModel.getProperty("/isAdmin"))){
      if (movimientoH.getDateValue() < hacedosaños){
        MessageBox.warning("La fecha seleccionada no tiene que superar los dos años");
        movimientoH.setValue("");
      }
    }
    },

    onSaldo: function (oEvent) {
      var movDesde = this.getView().byId("FechaDesdeID").getDateValue();
      if (oEvent.getSource().getPressed()) {
        fechaSaldo = this._manipulateDate(movDesde, 1, "sub");
        saldoAcumulado = true;
        this.getView().byId("detalleCtaCorrTabla").rebindTable();
      }
      else {
        saldoAcumulado = false;
        this.getView().byId("detalleCtaCorrTabla").rebindTable();
      }
    },

    _manipulateDate: function (date, days, operation) {
      var dateOffset = (24 * 60 * 60 * 1000) * days;
      var myDate = new Date();
      if (operation === "sub") {
        myDate.setTime(date.getTime() - dateOffset);
      }
      else if (operation === "add") {
        myDate.setTime(date.getTime() + dateOffset);
      }
      return myDate;
    },

    onTableUpdateFinished: function () {
      var oTable = this.byId("_detalleCtaCorriente");
      var items = oTable.getItems();
      var oItem = items[0].getCells();
      var Fila = oItem[3].mProperties;
      if (Fila.text === "Saldo Acumulado") {
        oController.getModel("ctaView").setProperty("/showBotonSaldo", true);
      }
      else {
        if (saldoAcumulado === false){
        oController.getModel("ctaView").setProperty("/showBotonSaldo", false);
        }
      }
    },

    onNavBack: function () {
      var sPreviousHash = History.getInstance().getPreviousHash();
      this.onClear();
      if (sPreviousHash !== undefined) {
        history.go(-1);
      } else {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteMainView", {}, true);
      }
    },

    onClear: function(){
       this.getView().byId("DP1").setValue("");
       this.getView().byId("FechaDesdeID").setValue("");
       this.getView().byId("FechaHastaID").setValue("");
       oController.getModel("ctaView").setProperty("/toggleButton", false);
       oController.getModel("ctaView").setProperty("/showBotonSaldo", false);
       saldoAcumulado = false;
      this.getView().byId("detalleCtaCorrTabla").rebindTable();
    },

    onBeforeExport: function (oEvent){
      var columnDoc = oEvent.getParameter("exportSettings").workbook.columns;
      for (var i = 0; i < columnDoc.length; i++ ){
        if (columnDoc[i].label == "Doc")
        {
          columnDoc.splice(i, 1);
        }
      }
      oEvent.getParameter("userExportSettings").includeFilterSettings = true;
      oEvent.getParameter("userExportSettings").splitCells = true;
      oEvent.getParameter("exportSettings").worker = false;
    },

    onPdfDocumento: function (oEvent) {
      var oModel = this.getView().getModel("relatedDocs");
      var ruta = oModel.sServiceUrl;
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      var Año = oTabla.Budat.getFullYear();
      var rutaRecibo = this.getView().getModel().sServiceUrl;
      var blart;
      var sPath;
      var oFormat;
      // eslint-disable-next-line camelcase
      var lv_path;
      var fecha;
      if (oTabla.Blart === "RC"){
        oFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyyMMdd",
          UTC: true
        });
        fecha = oFormat.format(oTabla.Budat);
        // eslint-disable-next-line camelcase
        lv_path = rutaRecibo + "/pdfRecibosSet('" + oTabla.Zuonr + fecha + oTabla.Blart + "')/$value";
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
      }
      else if (oTabla.Blart === "DC" || oTabla.Blart === "CC" || oTabla.Blart === "FK" || oTabla.Blart === "KF") {
       oFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyyMMdd",
          UTC: true
        });
        fecha = oFormat.format(oTabla.Budat);
       // eslint-disable-next-line camelcase
        lv_path = rutaRecibo + "/pdfRecibosSet('" + oTabla.Zuonr + fecha + oTabla.Blart + "')/$value";
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
      }
      else if (oTabla.Blart == "FZ" || oTabla.Blart == "DZ" || oTabla.Blart == "FR" || oTabla.Blart == "DG" || oTabla.Blart == "FV" || oTabla.Blart == "FA" || oTabla.Blart == "FH" || oTabla.Blart == "FS"){
        blart = "FAC";
        // sPath = `${ruta}/PrinterSet(TipoDoc='${blart}',Documento='${oTabla.Zuonr}')/$value`;
        oFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyyMMdd",
          UTC: true
        });
        fecha = oFormat.format(oTabla.Budat);
          sPath = `${ruta}/PrinterSet(TipoDoc='${blart}',Documento='${oTabla.Zuonr}${fecha}')/$value`;
        $.get({
            url: sPath,
            success: function () {
              window.open(sPath, "_blank");
            }
        }).fail(function () {
            MessageToast.show("Documento no encontrado");
        });
      }

      else {
      blart = "REM";
      sPath = `${ruta}/PrinterSet(TipoDoc='${blart}',Documento='${oTabla.Zuonr}')/$value`;
        $.get({
            url: sPath,
            success: function () {
              // eslint-disable-next-line no-unused-vars
              window.open(sPath, "_blank");
            }
        }).fail(function () {
            MessageToast.show("Documento no encontrado");
        });
    }
    },

    onPressComprobante: function (oEvent) {

        var oTabla = oEvent.getSource().getBindingContext().getObject();
        var tipoDoc;
        var sPath;
        var blart = oEvent.getSource().getBindingContext().getObject().Blart;
        if (blart == "FZ" || blart == "DZ" || blart == "FR" || blart == "DG" || blart == "FV" || blart == "FA" || blart == "FH" || blart == "FS"){
          if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
          tipoDoc = "FAC";
                  var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyyMMdd",
          UTC: true
        });
          var fecha = oFormat.format(oTabla.Budat);
          sPath = `DocumentosRel-display?&/Documento/${tipoDoc},${oTabla.Zuonr}${fecha}`;
          var hash = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
          target: {
          shellHash: sPath
          }
        });
        var id = window.location.href.substring(window.location.href.indexOf("true&") + 5, window.location.href.lastIndexOf("&sap-startup"));
        var url = window.location.href.replace(id, "sap-ui-app-id=profertil.RelatedsDocs").split("#")[0] + hash ;
        //var url = urlH.replace("cp.portal/ui5appruntime.html", "site");
        sap.m.URLHelper.redirect(url, true);
        }
        }
        else if (blart == "RC"){
          this.onRecibo(oEvent);
        }
        else if (blart == "FK" || blart == "KF" || blart == "CC" || blart == "DC" || blart == "PU" || blart == "GF" || blart == "GC" || blart == "GD"){
          tipoDoc = "";
        }
        else if (blart == "CL"){
          tipoDoc = "";
        }
        else {
          tipoDoc = "";
        }

    },

    onRecibo: function (oEvent){
      var oRecibo = oEvent.getSource().getBindingContext().getObject();
      this.Belnr = oRecibo.Belnr;
      this.Budat = oRecibo.Budat.getFullYear();
      if (!this._valueHelpDetalle || this._valueHelpDetalle.length == 0) {
          this._valueHelpDetalle = sap.ui.xmlfragment("profertil.appCtaCorriente.fragments.detalleRecibo", this);
          this.getView().addDependent(this._valueHelpDetalle);
      }
      this._valueHelpDetalle.open();
      sap.ui.getCore().byId("detalleRecibos").rebindTable();
    },

    onCancelarRecibos: function() {
      this._valueHelpDetalle.close();
    },

    beforeDetalle: function (oEvent) {
      var oBindingParams = oEvent.getParameter("bindingParams");
      oBindingParams.filters.push(new Filter("BELNR", FilterOperator.EQ, this.Belnr));
      oBindingParams.filters.push(new Filter("GJAHR", FilterOperator.EQ, this.Budat));
    },

    onBeforeRebindTable: function (oEvent) {
      var hoy = new Date();
      var date = this.getView().byId("DP1").getDateValue();
      var movDesde = this.getView().byId("FechaDesdeID");
      var movHasta = this.getView().byId("FechaHastaID");

      var fechaMovDesde = movDesde.getDateValue();
      var fechaMovHasta = movHasta.getDateValue();

      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      if (saldoAcumulado === false){
      if (date == null && fechaMovDesde == null && fechaMovHasta == null) {
        oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, hoy));
      }
      if (this.filterBuscar == false){
      if (date){
        oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, date));
      }
    }
    else {
      if (fechaMovDesde) {
        oBindingParams.filters.push(new Filter("FechaMovDesde", FilterOperator.EQ, fechaMovDesde));
      }
      if (fechaMovHasta) {
        oBindingParams.filters.push(new Filter("FechaMovHasta", FilterOperator.EQ, fechaMovHasta));
      }
    }
    }
    else
    {
      oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, fechaSaldo));
    }
      oBindingParams.filters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));

    },

    handleChange: function () {
      oController.getModel("ctaView").setProperty("/toggleButton", false);
      oController.getModel("ctaView").setProperty("/showBotonSaldo", false);
      saldoAcumulado = false;
      this.filterBuscar = true;
      this.getView().byId("detalleCtaCorrTabla").rebindTable();
    },

    onChangeFechaSaldo: function () {
      oController.getModel("ctaView").setProperty("/toggleButton", false);
      oController.getModel("ctaView").setProperty("/showBotonSaldo", false);
      saldoAcumulado = false;
      this.filterBuscar = false;
      this.getView().byId("detalleCtaCorrTabla").rebindTable();
    },

    onData: function(){
      this.cosa = true;
    }

  });
});
