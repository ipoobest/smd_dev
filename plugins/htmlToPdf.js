import html2Canvas from "html2canvas";
import jsPDF from "jspdf";

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function(title, isShowPreviewFullTime) {
      html2Canvas(document.querySelector("#pdfDom"), {
        useCORS: true,
        x: 450,
        y: 30
      }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/jpeg')
        const doc = new jsPDF('l', 'pt', [canvas.height, 850])
        doc.addImage(imgData, 'jpeg', 0, 0, canvas.width, canvas.height)
        doc.save('report.pdf')
      });
    };
  }
};

