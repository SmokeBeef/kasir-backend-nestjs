import { Response } from 'express';
const data = (data: any, isError: boolean, message?: string) => {
  return {
    data,
    isError,
    message,
  };
};

const response = (
  res: Response,
  data: any,
  message: string,
  code: number,
  pagination?: any,
) => {
  if (pagination)
    return res.status(code).json({
      success: code < 400,
      data,
      message,
      code,
      pagination,
    });
  else
    return res.status(code).json({
      success: code < 400,
      data,
      message,
      code,
    });
};

export default {
  data,
  response,
};
