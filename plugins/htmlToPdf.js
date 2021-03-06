import html2Canvas from "html2canvas";
import JsPDF from "jspdf";

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function(title, isShowPreviewFullTime) {
      window.scrollTo(0,0);
      html2Canvas(document.querySelector("#pdfDom"), {
        allowTaint: false,
        useCORS: true,
        scale: 2
      }).then(function(canvas) {
        let pageData = canvas.toDataURL("image/png", 0.9);
        let PDF = new JsPDF("p", "mm", "a2");

        let width = 320;
        let height = 370;

        PDF.addImage(pageData, "PNG", 55, 40, width, height);
        PDF.save(title + ".pdf");
      
      });
    };
    Vue.prototype.getPdfGradeSumary = function(title, isShowPreviewFullTime) {
      html2Canvas(document.querySelector("#gradeSummary"), {
        allowTaint: false,
        useCORS: true,
        x: 230,
        y: 30
      }).then(function(canvas) {
        let pageWidth = 595.28;
        let pageHeight = canvas.height / (canvas.width / 592.28);
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let PDF = new JsPDF("", "pt", [pageWidth, pageHeight]);
        PDF.addImage(pageData, "JPEG", 0, 0, pageWidth, pageHeight);
        PDF.save(title + ".pdf");
      });
    };
  }
};