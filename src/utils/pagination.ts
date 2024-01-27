export const calcTakeSkip = (page: any, perpage: any) => {
  const result = {
    skip: 0,
    take: 0,
    page: 1,
  };

  if (isNumeric(perpage)) {
    result.take = +perpage;
  } else {
    result.take = 25;
  }

  if (isNumeric(page)) {
    result.skip = (+page - 1) * result.take;
    result.page = page;
  }
  return result;
};

export function isNumeric(number: any) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

export const metaPagination = (
  page: number,
  take: number,
  totalData: number,
) => {
  const totalPage = Math.ceil(totalData / take);
  return {
    page,
    perpage: take,
    totalPage,
    totalData: totalData,
    nextVisible: page < totalPage,
  };
};
