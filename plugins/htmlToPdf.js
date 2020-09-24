import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function (title, isShowPreviewFullTime) {
      html2Canvas(document.querySelector("#pdfDom"), {
        useCORS: true,
         dpi: 192,
         size: 'a4'
        // x:210,
        // y:297
      }).then(function(canvas) {
        // let pageWidth = 595.28;
        // let pageHeight = canvas.height / (canvas.width / 592.28)
        let pageData = canvas.toDataURL("image/jpeg", 1);
        // let PDF = new JsPDF("p", "pt", [pageWidth, pageHeight]);
        // PDF.addImage(pageData, "JPEG", 55, 20, pageWidth, pageHeight);

        // PDF.save(title + '.pdf')
        var doc = new JsPDF("l", "mm", "a4");

        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        console.log("widht, height", width, height);
        doc.addImage(pageData, "JPEG", 0, 0, height, width);
        doc.save(title + ".pdf");
      });
    }
  }
}