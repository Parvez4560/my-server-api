function validateDocuments(accountType, documents) {
  if (!documents || documents.length === 0) {
    return 'Documents are required';
  }

  const providedTypes = documents.map(d => d.docType);

  if (accountType === 'Personal') {
    const requiredDocs = ['NID', 'Passport', 'BirthCertificate'];
    if (!providedTypes.some(d => requiredDocs.includes(d))) {
      return 'Personal account requires NID, Passport, or Birth Certificate';
    }
  }

  if (accountType === 'Agent') {
    const requiredDocs = ['NID', 'TradeLicense'];
    if (!requiredDocs.every(d => providedTypes.includes(d))) {
      return 'Agent account requires NID and Trade License';
    }
  }

  if (accountType === 'Merchant') {
    const requiredDocs = ['NID', 'TradeLicense', 'TIN'];
    if (!requiredDocs.every(d => providedTypes.includes(d))) {
      return 'Merchant account requires NID, Trade License, and TIN';
    }
  }

  return null; // no error
}

module.exports = validateDocuments;