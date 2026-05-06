export const sendResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data
  });
};

export const sendPaginatedResponse = (res, statusCode, message, pageIndex, pageSize, totalRecords, data) => {
  const pIndex = Number(pageIndex) || 1;
  const pSize = Number(pageSize) || 10;
  const hasNextPage = (pIndex * pSize) < totalRecords;
  const hasPreviousPage = pIndex > 1;

  return res.status(statusCode).json({
    statusCode,
    message,
    pageIndex: pIndex,
    pageSize: pSize,
    totalRecords,
    hasNextPage,
    hasPreviousPage,
    data
  });
};
