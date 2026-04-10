import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface QuotationData {
  id: string;
  quoteNumber: string;
  client: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  currentAddress?: string;
  date: string;
  validUntil: string;
  dueDate: string;
  currency: string;
  taxRate: number;
  discount: number;
  discountAmount: number;
  discountType: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  selectedCategory?: string;
  option2Heading?: string;
  showOption2InPdf?: boolean;
  option2Services?: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  quoteNote?: string;
  showQuoteNoteInPdf?: boolean;
  notes: string;
  terms: string;
  confirmationLetter?: string;
  insuranceSectionTitle?: string;
  insuranceAcceptedText?: string;
  insuranceDeclinedText?: string;
  insuranceTextFieldLabel?: string;
  companySealImage?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    swiftCode: string;
    iban: string;
  };
  paymentMethods: string[];
  services: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  products: Array<{
    id: string;
    name: string;
    sku: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy: string;
  createdByPhone?: string;
  assignedTo?: string;
  assignedToId?: string;
  showAssignedToInPdf?: boolean;
}

export const generateQuotationPDF = (quotation: QuotationData): { pdf: jsPDF, fileName: string, blobUrl: string } => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  const BRAND: [number, number, number] = [236, 72, 153];
  const BRAND_SOFT: [number, number, number] = [252, 240, 247];
  const SOFT_GRAY: [number, number, number] = [244, 244, 244];
  const BORDER_GRAY: [number, number, number] = [210, 210, 210];
  const TEXT_PRIMARY: [number, number, number] = [28, 30, 34];
  const TEXT_MUTED: [number, number, number] = [68, 70, 74];
  const TEXT_SUBTLE: [number, number, number] = [110, 112, 116];
  const FONT_HEADING = 'helvetica';
  const FONT_BODY = 'times';
  const pageTopContentY = 34;
  const pageBottomSafeY = 14;

  let yPos = pageTopContentY;

  const stripHtml = (value: string): string => {
    return value
      .replace(/\r\n/g, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li>/gi, '• ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      // Ensure each bullet starts on a fresh line for clean PDF wrapping.
      .replace(/\s*•\s*/g, '\n• ')
      .replace(/([^\n])\n•\s*/g, '$1\n• ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  };

  const allItems = [
    ...quotation.services.map(service => ({
      description: service.description ? `${service.name}\n${stripHtml(service.description)}` : service.name,
      quantity: service.quantity,
      amount: service.total,
    })),
    ...quotation.products.map(product => ({
      description: [product.name, product.description ? stripHtml(product.description) : '', product.sku ? `SKU: ${product.sku}` : ''].filter(Boolean).join('\n'),
      quantity: product.quantity,
      amount: product.total,
    })),
  ];

  const currencyCode = (quotation.currency || 'AED').toUpperCase();
  const hasContactPhone = Boolean(quotation.phone?.trim());
  const hasContactEmail = Boolean(quotation.email?.trim());

  const serviceSummary = allItems.length > 0
    ? allItems[0].description.split('\n')[0]
    : 'General Cleaning Service';
  const serviceType = quotation.selectedCategory?.trim() || serviceSummary;

  const formatQuantity = (quantity: number) => {
    const numericQuantity = Number(quantity);
    if (!Number.isFinite(numericQuantity)) return '1';
    return Number.isInteger(numericQuantity)
      ? String(numericQuantity)
      : numericQuantity.toFixed(2);
  };

  const getValidityText = () => {
    if (!quotation.date || !quotation.validUntil) return formatDate(quotation.validUntil);
    const issueDate = new Date(quotation.date);
    const validDate = new Date(quotation.validUntil);
    if (Number.isNaN(issueDate.getTime()) || Number.isNaN(validDate.getTime())) {
      return formatDate(quotation.validUntil);
    }

    const dayMs = 1000 * 60 * 60 * 24;
    const diffDays = Math.max(0, Math.ceil((validDate.getTime() - issueDate.getTime()) / dayMs));
    return diffDays > 0 ? `${diffDays} days` : formatDate(quotation.validUntil);
  };

  const getImageFormat = (imageSource: string): 'PNG' | 'JPEG' => {
    const lower = imageSource.toLowerCase();
    if (lower.startsWith('data:image/png')) return 'PNG';
    return 'JPEG';
  };

  const drawHeader = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFont(FONT_BODY, 'bold');
    doc.setFontSize(15.5);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text('QUOTATION', margin, 14.5);

    doc.setFont(FONT_BODY, 'italic');
    doc.setFontSize(8.2);
    doc.setTextColor(...TEXT_SUBTLE);
    doc.text('Service Proposal', margin, 19.2);

    try {
      doc.addImage('/logo.jpeg', 'JPEG', pageWidth - margin - 28, 5, 28, 20);
    } catch {
      doc.setFont(FONT_HEADING, 'bold');
      doc.setFontSize(9);
      doc.text('HOMEWORK UAE', pageWidth - margin, 14, { align: 'right' });
    }

    doc.setDrawColor(...BRAND);
    doc.setLineWidth(0.35);
    doc.line(margin, 28, pageWidth - margin, 28);
  };

  const drawFooter = (pageNumber: number, totalPages: number) => {
    const y = pageHeight - 7;
    doc.setDrawColor(...BORDER_GRAY);
    doc.setLineWidth(0.2);
    doc.line(margin, y - 3, pageWidth - margin, y - 3);

    doc.setFont(FONT_BODY, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...TEXT_SUBTLE);
    doc.text(`Page ${pageNumber}`, pageWidth - margin, y, { align: 'right' });

    if (pageNumber === 1) {
      doc.text(quotation.quoteNumber, margin, y);
    } else {
      doc.text(`${quotation.quoteNumber} | ${pageNumber}/${totalPages}`, margin, y);
    }
  };

  const ensureSpace = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - pageBottomSafeY) {
      doc.addPage();
      drawHeader();
      yPos = pageTopContentY;
      return true;
    }
    return false;
  };

  const drawSectionBar = (label: string) => {
    ensureSpace(9);
    doc.setFillColor(...SOFT_GRAY);
    doc.rect(margin, yPos, contentWidth, 7, 'F');
    doc.setDrawColor(...BORDER_GRAY);
    doc.setLineWidth(0.2);
    doc.rect(margin, yPos, contentWidth, 7, 'S');

    doc.setFont(FONT_HEADING, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(label, pageWidth / 2, yPos + 4.6, { align: 'center' });
    yPos += 9;
  };

  const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 8, lineHeight = 4) => {
    doc.setFont(FONT_BODY, 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(...TEXT_MUTED);
    const lines = doc.splitTextToSize(text, maxWidth);
    ensureSpace((lines.length * lineHeight) + 2);
    doc.text(lines, x, y);
    return lines.length * lineHeight;
  };

  const estimateTextHeight = (text: string, maxWidth: number, fontSize = 8, lineHeight = 4) => {
    doc.setFont(FONT_BODY, 'normal');
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    return lines.length * lineHeight;
  };

  drawHeader();

  // Header info blocks
  const infoGap = 4;
  const infoBoxWidth = (contentWidth - infoGap) / 2;
  const rightInfoRows: Array<[string, string]> = [
    ['Quote No:', quotation.quoteNumber || 'N/A'],
    ['Date:', formatDate(quotation.date)],
    ['Sales Executive:', quotation.createdBy || 'N/A'],
    ['Service Type:', serviceType],
  ];

  if (quotation.showAssignedToInPdf && quotation.assignedTo?.trim()) {
    rightInfoRows.splice(3, 0, ['Assigned To:', quotation.assignedTo.trim()])
  }

  const recipientLines: string[] = [];
  if (quotation.company?.trim()) recipientLines.push(quotation.company.trim());
  if (quotation.client?.trim() && quotation.client.trim() !== quotation.company?.trim()) {
    recipientLines.push(quotation.client.trim());
  }
  if (quotation.currentAddress?.trim()) recipientLines.push(`Address: ${quotation.currentAddress.trim()}`);
  if (hasContactPhone) recipientLines.push(`Phone: ${quotation.phone.trim()}`);
  if (hasContactEmail) recipientLines.push(`Email: ${quotation.email.trim()}`);
  if (recipientLines.length === 0) recipientLines.push('Valued Customer');

  const leftLineCount = recipientLines.reduce((sum, line) => {
    return sum + doc.splitTextToSize(line, infoBoxWidth - 6).length;
  }, 0);

  const rightLineCount = rightInfoRows.reduce((sum, [, value]) => {
    return sum + doc.splitTextToSize(value, infoBoxWidth - 34).length;
  }, 0);

  const infoBoxHeight = Math.max(25, (Math.max(leftLineCount, rightLineCount) * 3.4) + 10);
  const leftX = margin;
  const rightX = margin + infoBoxWidth + infoGap;

  doc.setDrawColor(...BRAND);
  doc.setLineWidth(0.3);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(leftX, yPos, infoBoxWidth, infoBoxHeight, 1, 1, 'FD');
  doc.roundedRect(rightX, yPos, infoBoxWidth, infoBoxHeight, 1, 1, 'FD');

  doc.setFont(FONT_HEADING, 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text('Attention:', leftX + 3, yPos + 4.8);

  let leftInfoY = yPos + 8.8;

  recipientLines.forEach((line, idx) => {
    const wrapped = doc.splitTextToSize(line, infoBoxWidth - 6);
    wrapped.forEach((wrappedLine: string, wrappedIndex: number) => {
      doc.setFont(idx <= 1 && wrappedIndex === 0 ? FONT_HEADING : FONT_BODY, idx <= 1 && wrappedIndex === 0 ? 'bold' : 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...TEXT_PRIMARY);
      doc.text(wrappedLine, leftX + 3, leftInfoY);
      leftInfoY += 3.4;
    });
  });

  doc.setFont(FONT_HEADING, 'bold');
  doc.setFontSize(7.7);
  const rightLabelX = rightX + 3;
  const rightValueX = rightX + 30;
  let rightInfoY = yPos + 4.8;

  rightInfoRows.forEach(([label, value]) => {
    doc.setFont(FONT_HEADING, 'bold');
    doc.setTextColor(...TEXT_SUBTLE);
    doc.text(label, rightLabelX, rightInfoY);
    doc.setFont(FONT_BODY, 'normal');
    doc.setTextColor(...TEXT_PRIMARY);
    const wrappedValue = doc.splitTextToSize(value, infoBoxWidth - 34);
    doc.text(wrappedValue, rightValueX, rightInfoY);
    rightInfoY += Math.max(3.7, wrappedValue.length * 3.4);
  });

  yPos += infoBoxHeight + 6;

  // Recipient highlight bar
  const recipientText = quotation.company || quotation.client || 'Valued Customer';
  const recipientLinesWrapped = doc.splitTextToSize(recipientText, contentWidth - 6);
  const recipientBarHeight = Math.max(6.5, (recipientLinesWrapped.length * 3.5) + 2);

  doc.setFillColor(...SOFT_GRAY);
  doc.rect(margin, yPos, contentWidth, recipientBarHeight, 'F');
  doc.setDrawColor(...BORDER_GRAY);
  doc.setLineWidth(0.2);
  doc.rect(margin, yPos, contentWidth, recipientBarHeight, 'S');
  doc.setFont(FONT_BODY, 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(...TEXT_PRIMARY);
  const recipientTextY = yPos + ((recipientBarHeight - (recipientLinesWrapped.length * 3.5)) / 2) + 2.8;
  doc.text(recipientLinesWrapped, pageWidth / 2, recipientTextY, { align: 'center' });
  yPos += recipientBarHeight + 3.5;

  // Intro text
  const introText =
    'We thank you for giving us an opportunity to quote for this service. Based on your request, we are pleased to present our proposal for your consideration. Rest assured that every care and attention will be offered throughout as quality of service and customer satisfaction is paramount to Homework UAE.';
  ensureSpace(estimateTextHeight(introText, contentWidth, 8.1, 4.2) + 9);
  doc.setFont(FONT_BODY, 'italic');
  doc.setFontSize(8.7);
  doc.setTextColor(...TEXT_SUBTLE);
  doc.text('Dear Valued Client,', margin, yPos);
  yPos += 5;
  yPos += drawWrappedText(introText, margin, yPos, contentWidth, 8.1, 4.2) + 4;

  // Charges table
  ensureSpace(40);
  const chargesHeader = `${quotation.location ? `Location - ${quotation.location}` : 'Service Location'}`;
  const tableItems = allItems.length > 0
    ? allItems
    : [{ description: 'Cleaning service as per agreed scope', quantity: 1, amount: quotation.subtotal || quotation.total || 0 }];

  const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
  const servicesSubtotal = roundMoney(tableItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0));
  const taxRate = Number.isFinite(Number(quotation.taxRate)) ? Number(quotation.taxRate) : 0;
  const vatAmount = roundMoney((servicesSubtotal * taxRate) / 100);
  const totalIncludingTax = roundMoney(servicesSubtotal + vatAmount);

  const option2TableItems = (quotation.option2Services || []).map((service) => ({
    description: service.description ? `${service.name}\n${stripHtml(service.description)}` : service.name,
    quantity: service.quantity,
    amount: service.total,
  }));

  autoTable(doc, {
    startY: yPos,
    head: [[chargesHeader, '#', `Charges (${currencyCode})`]],
    body: [
      ...tableItems.map(item => [item.description, formatQuantity(item.quantity), formatCurrency(item.amount)]),
      ['SUBTOTAL (Services)', '-', formatCurrency(servicesSubtotal)],
      [`VAT ${taxRate}%`, '-', formatCurrency(vatAmount)],
      ['TOTAL (Including Tax)', '-', formatCurrency(totalIncludingTax)],
    ],
    theme: 'grid',
    margin: { top: pageTopContentY, bottom: pageBottomSafeY, left: margin, right: margin },
    styles: {
      font: FONT_BODY,
      fontSize: 7.8,
      cellPadding: 2.4,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
      textColor: TEXT_PRIMARY,
      overflow: 'linebreak',
      valign: 'top',
    },
    headStyles: {
      fillColor: SOFT_GRAY,
      textColor: TEXT_PRIMARY,
      font: FONT_HEADING,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: contentWidth - 52 },
      1: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
    },
    didParseCell: data => {
      if (
        data.section === 'body' &&
        (data.row.index === tableItems.length || data.row.index === tableItems.length + 2)
      ) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.font = FONT_HEADING;
      }
      if (data.section === 'body' && data.column.index === 2) {
        data.cell.styles.halign = 'right';
      }
      if (data.section === 'body' && data.column.index === 1) {
        data.cell.styles.halign = 'center';
      }
      if (data.section === 'body' && data.column.index === 0) {
        data.cell.styles.font = FONT_BODY;
      }
    },
    didDrawPage: () => {
      drawHeader();
    },
  });

  const tableDoc = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  yPos = (tableDoc.lastAutoTable?.finalY ?? yPos) + 7;

  if (quotation.showOption2InPdf && option2TableItems.length > 0) {
    drawSectionBar(quotation.option2Heading?.trim() || 'Option 2 - Comparative Offer');
    ensureSpace(24);

    autoTable(doc, {
      startY: yPos,
      head: [['Service Details', '#', `Charges (${currencyCode})`]],
      body: option2TableItems.map(item => [item.description, formatQuantity(item.quantity), formatCurrency(item.amount)]),
      theme: 'grid',
      margin: { top: pageTopContentY, bottom: pageBottomSafeY, left: margin, right: margin },
      styles: {
        font: FONT_BODY,
        fontSize: 7.8,
        cellPadding: 2.4,
        lineColor: BORDER_GRAY,
        lineWidth: 0.2,
        textColor: TEXT_PRIMARY,
        overflow: 'linebreak',
        valign: 'top',
      },
      headStyles: {
        fillColor: SOFT_GRAY,
        textColor: TEXT_PRIMARY,
        font: FONT_HEADING,
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: contentWidth - 52 },
        1: { cellWidth: 12, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
      },
      didParseCell: data => {
        if (data.section === 'body' && data.column.index === 2) {
          data.cell.styles.halign = 'right';
        }
        if (data.section === 'body' && data.column.index === 1) {
          data.cell.styles.halign = 'center';
        }
        if (data.section === 'body' && data.column.index === 0) {
          data.cell.styles.font = FONT_BODY;
        }
      },
      didDrawPage: () => {
        drawHeader();
      },
    });

    yPos = (tableDoc.lastAutoTable?.finalY ?? yPos) + 7;
  }

  // Payment terms table
  ensureSpace(28);
  autoTable(doc, {
    startY: yPos,
    body: [
      ['Payment Terms', quotation.paymentMethods?.length ? quotation.paymentMethods.join(', ') : '100% Advance'],
      ['Quote Validity', getValidityText()],
      ['VAT', `Prices are inclusive of ${quotation.taxRate}% Tax except for per-hour rates and extra services.`],
    ],
    theme: 'grid',
    margin: { top: pageTopContentY, bottom: pageBottomSafeY, left: margin, right: margin },
    styles: {
      font: FONT_BODY,
      fontSize: 7.6,
      cellPadding: 2.5,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
      textColor: TEXT_PRIMARY,
    },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold' },
      1: { cellWidth: contentWidth - 38 },
    },
    didDrawPage: () => {
      drawHeader();
    },
    didParseCell: data => {
      if (data.section === 'body' && data.column.index === 0) {
        data.cell.styles.font = FONT_HEADING;
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = TEXT_SUBTLE;
      }
    },
  });

  yPos = (tableDoc.lastAutoTable?.finalY ?? yPos) + 8;

  // Terms section
  drawSectionBar('Terms & Conditions');

  const termsText = quotation.terms?.trim();
  const notesText = quotation.notes?.trim();

  const termsDetails = termsText ||
    'In the event of damage, Homework UAE will carry out a reasonable repair (not replacement) for the damaged goods and the cost of which will be limited to market value of similar items in the local market.';

  const termsRows: Array<[string, string]> = [
    ['Liability', termsDetails],
  ];

  if (notesText) {
    termsRows.push(['Payment Terms', notesText]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [['Section', 'Details']],
    body: termsRows,
    theme: 'grid',
    margin: { top: pageTopContentY, bottom: pageBottomSafeY, left: margin, right: margin },
    styles: {
      font: FONT_BODY,
      fontSize: 7.5,
      cellPadding: 2.6,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
      textColor: TEXT_PRIMARY,
      overflow: 'linebreak',
      valign: 'top',
    },
    headStyles: {
      fillColor: SOFT_GRAY,
      textColor: TEXT_PRIMARY,
      font: FONT_HEADING,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 34, fontStyle: 'bold' },
      1: { cellWidth: contentWidth - 34 },
    },
    didParseCell: data => {
      if (data.section === 'body' && data.column.index === 0) {
        data.cell.styles.fillColor = BRAND_SOFT;
        data.cell.styles.font = FONT_HEADING;
        data.cell.styles.textColor = TEXT_SUBTLE;
      }
    },
    didDrawPage: () => {
      drawHeader();
    },
  });

  yPos = (tableDoc.lastAutoTable?.finalY ?? yPos) + 6;

  yPos += 5;
  ensureSpace(estimateTextHeight('On behalf of all at Homework UAE, thank you for your enquiry. We hope to serve you and look forward to hearing from you soon.', contentWidth, 8, 4) + 8);
  doc.setFont(FONT_BODY, 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(...TEXT_MUTED);
  const closingLines = doc.splitTextToSize('On behalf of all at Homework UAE, thank you for your enquiry. We hope to serve you and look forward to hearing from you soon.', contentWidth);
  doc.text(closingLines, margin, yPos);
  yPos += (closingLines.length * 4) + 4;

  doc.setFont(FONT_BODY, 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_SUBTLE);
  doc.text('Yours sincerely,', margin, yPos);
  yPos += 4.5;
  doc.setFont(FONT_HEADING, 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text((quotation.createdBy || 'Sales Executive').toUpperCase(), margin, yPos);

  const quoteNoteText = quotation.quoteNote?.trim() || '';
  const shouldShowQuoteNote = Boolean(quotation.showQuoteNoteInPdf ?? true) && Boolean(quoteNoteText);

  // Optional note/acceptance/bank page
  if (shouldShowQuoteNote || (quotation.confirmationLetter && quotation.confirmationLetter.trim()) || quotation.bankDetails) {
    doc.addPage();
    drawHeader();
    yPos = pageTopContentY;

    if (shouldShowQuoteNote) {
      drawSectionBar('NOTE');

      autoTable(doc, {
        startY: yPos,
        body: [[quoteNoteText]],
        theme: 'grid',
        margin: { top: pageTopContentY, bottom: pageBottomSafeY, left: margin, right: margin },
        styles: {
          font: FONT_BODY,
          fontSize: 7.6,
          cellPadding: 2.6,
          lineColor: BORDER_GRAY,
          lineWidth: 0.2,
          textColor: TEXT_PRIMARY,
          overflow: 'linebreak',
          valign: 'top',
        },
        columnStyles: {
          0: { cellWidth: contentWidth },
        },
        didDrawPage: () => {
          drawHeader();
        },
      });

      yPos = (tableDoc.lastAutoTable?.finalY ?? yPos) + 6;
    }

    drawSectionBar('CONFIRMATION LETTER / ACCEPTANCE FORM');

    const acceptanceText = quotation.confirmationLetter?.trim() ||
      `I/We accept the terms & conditions of your above quotation with Quotation No: ${quotation.quoteNumber} dated on ${formatDate(quotation.date)} and request you to commence packing on _______________.`;


    autoTable(doc, {
      startY: yPos,
      body: [[acceptanceText]],
      theme: 'grid',
      margin: { top: pageTopContentY, bottom: pageBottomSafeY, left: margin, right: margin },
      styles: {
        font: FONT_BODY,
        fontSize: 7.6,
        cellPadding: 2.6,
        lineColor: BORDER_GRAY,
        lineWidth: 0.2,
        textColor: TEXT_PRIMARY,
        overflow: 'linebreak',
        valign: 'top',
      },
      columnStyles: {
        0: { cellWidth: contentWidth },
      },
      didDrawPage: () => {
        drawHeader();
      },
    });

    yPos = (tableDoc.lastAutoTable?.finalY ?? yPos) + 8;

    const signatureGap = 8;
    const signBoxWidth = (contentWidth - signatureGap) / 2;
    const signBoxHeight = 36;
    if (ensureSpace(signBoxHeight + 12)) {
      drawSectionBar('SIGNATURES');
    }

    const leftBoxX = margin;
    const rightBoxX = leftBoxX + signBoxWidth + signatureGap;

    doc.setDrawColor(...BORDER_GRAY);
    doc.setLineWidth(0.2);
    doc.rect(leftBoxX, yPos, signBoxWidth, signBoxHeight, 'S');
    doc.rect(rightBoxX, yPos, signBoxWidth, signBoxHeight, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.1);
    doc.setTextColor(...TEXT_SUBTLE);

    doc.text('Customer Signature', leftBoxX + 2, yPos + signBoxHeight - 10);
    doc.line(leftBoxX + 36, yPos + signBoxHeight - 10.5, leftBoxX + signBoxWidth - 3, yPos + signBoxHeight - 10.5);
    doc.text('Date:', leftBoxX + 2, yPos + signBoxHeight - 4);
    doc.line(leftBoxX + 18, yPos + signBoxHeight - 4.5, leftBoxX + signBoxWidth - 3, yPos + signBoxHeight - 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text('For Homework UAE (Authorized Signatory)', rightBoxX + 2, yPos + 5);

    if (quotation.companySealImage?.trim()) {
      try {
        const imageFormat = getImageFormat(quotation.companySealImage);
        doc.addImage(
          quotation.companySealImage,
          imageFormat,
          rightBoxX + 4,
          yPos + 8,
          signBoxWidth - 8,
          signBoxHeight - 16,
        );
      } catch {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...TEXT_SUBTLE);
        doc.text('Company Seal/Signature', rightBoxX + 2, yPos + signBoxHeight - 4);
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...TEXT_SUBTLE);
      doc.text('Company Seal/Signature', rightBoxX + 2, yPos + signBoxHeight - 4);
    }

    yPos += signBoxHeight + 8;

    if (quotation.bankDetails) {
      drawSectionBar(`Homework UAE Bank Details (${currencyCode})`);
      autoTable(doc, {
        startY: yPos,
        body: [
          ['ACCOUNT NAME', quotation.bankDetails.accountName || 'HOMEWORK CLEANING SERVICES LLC'],
          ['ACCOUNT NO', quotation.bankDetails.accountNumber || ''],
          ['BANK NAME', quotation.bankDetails.bankName || ''],
          ['SWIFT CODE', quotation.bankDetails.swiftCode || ''],
          ['IBAN NO', quotation.bankDetails.iban || ''],
        ],
        theme: 'grid',
        margin: { top: pageTopContentY, bottom: pageBottomSafeY, left: margin + 4, right: margin + 4 },
        styles: {
          font: FONT_BODY,
          fontSize: 7.7,
          cellPadding: 2.5,
          lineColor: BORDER_GRAY,
          lineWidth: 0.2,
          textColor: TEXT_PRIMARY,
        },
        columnStyles: {
          0: { cellWidth: 56, fontStyle: 'bold' },
          1: { cellWidth: contentWidth - 64 },
        },
        didDrawPage: () => {
          drawHeader();
        },
      });
    }
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  const fileName = `Quotation_${quotation.quoteNumber.replace('#', '')}_${(quotation.client || 'Client').replace(/\s+/g, '_')}.pdf`;
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);

  return { pdf: doc, fileName, blobUrl };
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, ' ');
};

export const downloadPDF = (quotation: QuotationData) => {
  const { pdf, fileName } = generateQuotationPDF(quotation);
  pdf.save(fileName);
};

export const getPDFAsBlob = (quotation: QuotationData): Blob => {
  const { pdf } = generateQuotationPDF(quotation);
  return pdf.output('blob');
};