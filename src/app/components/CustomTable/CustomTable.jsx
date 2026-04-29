import React from "react";
import { Table } from "antd";
import PropTypes from "prop-types";
import "./CustomTable.scss";

const CustomTable = ({
  rowKey = "id",
  columns,
  dataSource,
  loading = false,
  pageIndex = 0,
  pageSize = 10,
  total = 0,
  pageSizeOptions = [10, 20, 50, 100],
  showTotalText = true,
  scroll = { x: "max-content" },
  onPageChange,
  onTableChange,
  size = "small",
  rowSelection,
  expandable,
  ...rest
}) => {
  const paginationConfig = total > 0 ? {
    current: pageIndex + 1,
    pageSize,
    total,
    showSizeChanger: true,
    pageSizeOptions: pageSizeOptions.map(String),
    showTotal: showTotalText
      ? (total, range) => `${range[0]}-${range[1]} of ${total} records`
      : undefined,
  } : false;

  const handleChange = (pagination, filters, sorter, extra) => {
    const { current, pageSize } = pagination;
    if (onPageChange) {
      onPageChange(current, pageSize);
    }
    if (onTableChange) {
      onTableChange(pagination, filters, sorter, extra);
    }
  };

  return (
    <div className="custom-table-wrapper">
      <Table
        className="custom-table"
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={paginationConfig}
        scroll={scroll}
        onChange={handleChange}
        size={size}
        rowSelection={rowSelection}
        expandable={expandable}
        {...rest}
      />
    </div>
  );
};

CustomTable.propTypes = {
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  showTotalText: PropTypes.bool,
  scroll: PropTypes.object,
  onPageChange: PropTypes.func,
  onTableChange: PropTypes.func,
};

export default CustomTable;
