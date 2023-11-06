import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Spin,
  Tag,
  Tooltip,
  notification
} from "antd";
// import CreateNEditDialog, { Option } from "@/components/createNEditDialog";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FC, useCallback, useEffect, useState } from "react";

import { ActionField } from "@/interface/common";
import BaseTable from "@/components/base-table";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import DoubleCheckDeleteModal from "./doubleCheckDeleteModal";
import { IBangDiem } from "@/interface/bangdiem";
import { Link } from "react-router-dom";
import PageContainer from "@/Layout/PageContainer";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import bangDiemApi from "@/api/bangDiem/bangDiem.api";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
import { useTranslation } from "react-i18next";
import { NotificationInstance } from "antd/lib/notification/interface";
import moment from "moment";
import BangDiemEditor from "./edit-bang-diem";
import BangDiemCreate from "./them-moi-bang-diem";
import { getAuthUser } from "@/stores/features/auth";
import { useAppSelector } from "@/stores/hook";
import dayjs from "dayjs";
import { Paginate } from "@/interface/axios";
import { PaginationProps } from "antd/lib";
import BaseResponsive from "@/components/base-responsive";
import { getKiHienGio } from "@/stores/features/config";
import { useLoaiLopThi } from "@/hooks/useLoaiLopThi";
import { User } from "@/interface/user";
const defaultColDef = {
  flex: 1,
  minWidth: 250,
  resizable: true,
  filter: true,
  floatingFilter: true
};

const DanhSachBangDiem = () => {
  const [kiHoc, setKihoc] = useState<string[]>([]);
  const kiHienGio = useAppSelector(getKiHienGio);
  const [keyRender, setKeyRender] = useState(0);
  const [showModalBangDiem, setShowModalBangDiem] = useState(false);

  useEffect(() => {
    const getKyHoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data);
      }
    };
    getKyHoc();
  }, []);

  const contentDesktop = () => (
    <DanhSachBangDiemDesktop kiHoc={kiHoc} key={keyRender} />
  );
  const contentMobile = () =>
    kiHienGio && (
      <DanhSachBangDiemMobile
        kiHoc={kiHoc}
        kiHienGio={kiHienGio}
        key={keyRender}
      />
    );
  return (
    <>
      <PageContainer
        title="Danh sách bảng điểm môn học"
        extraTitle={
          <Button
            onClick={() => setShowModalBangDiem(true)}
            type="primary"
            style={{ float: "right" }}
          >
            Thêm bảng điểm
          </Button>
        }
      >
        <BaseResponsive
          contentDesktop={contentDesktop}
          contentMobile={contentMobile}
        />
        <BangDiemCreate
          showModal={showModalBangDiem}
          setShowModal={setShowModalBangDiem}
          setKeyRender={setKeyRender}
        />
      </PageContainer>
    </>
  );
};

export default DanhSachBangDiem;

const DanhSachBangDiemDesktop: FC<{ kiHoc: string[]; key: number }> = ({
  kiHoc
}) => {
  const { t } = useTranslation("danh-sach-bang-diem");
  const [keyRender, setKeyRender] = useState(0);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const authUser = useAppSelector(getAuthUser);

  const [data, setData] = useState<IBangDiem>();

  const [openTuDongNhapModal, setOpenTuDongNhapModal] = useState(false);
  const [openCongBoModal, setOpenCongBoModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const { items: dotThi, format: formatDotThi } = useLoaiLopThi();

  const [columnDefs, setColumDefs] = useState<
    ColDef<IBangDiem & ActionField>[]
  >([]);

  const [callnofi, contextholder] = notification.useNotification();
  useEffect(() => {
    const loai_columns: ColDef = {
      headerName: "Đợt thi",
      field: "ki_thi",
      filter: SelectFilter,
      floatingFilter: true,
      cellRenderer: loaiCellRenderer
    };

    if (dotThi && dotThi.length > 0) {
      loai_columns.floatingFilterComponent = SelectFloatingFilterCompoment;
      loai_columns.floatingFilterComponentParams = {
        suppressFilterButton: true,
        placeholder: "Đợt thi",
        data: dotThi.map((x) => ({
          label: x.title,
          value: x.value
        }))
      };
      loai_columns.cellRendererParams = {
        format: formatDotThi
      };
    }
    setColumDefs([
      {
        headerName: t("field.ki_hoc"),
        field: "ki_hoc",
        filter: SelectFilter,
        floatingFilter: true,
        floatingFilterComponent: SelectFloatingFilterCompoment,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Kỳ Học",
          data: kiHoc.map((x) => ({ value: x, label: x }))
        }
      },
      {
        headerName: t("field.ma_hp"),
        field: "ma_hp",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ten_hp"),
        field: "ten_hp",
        filter: "agTextColumnFilter"
      },
      loai_columns,
      {
        headerName: t("field.ghi_chu"),
        field: "ghi_chu",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ngay_cong_khai"),
        field: "ngay_cong_khai",
        filter: "agDateColumnFilter",
        cellRenderer: (x: any) => {
          return DateFormat(x.data, "ngay_cong_khai");
        }
      },
      {
        headerName: t("field.ngay_ket_thuc_phuc_khao"),
        field: "ngay_ket_thuc_phuc_khao",
        filter: "agDateColumnFilter",
        cellRenderer: (x: any) => {
          return DateFormat(x.data, "ngay_ket_thuc_phuc_khao");
        }
      },
      {
        headerName: t("field.trang_thai_nhan_dien"),
        field: "trang_thai_nhan_dien",
        // filter: "agTextColumnFilter",
        // filter: SelectFilter,
        floatingFilter: false,
        cellRenderer: StatusCellRender
        // floatingFilterComponent: SelectFloatingFilterCompoment,
        // floatingFilterComponentParams: {
        //   data: [
        //     { value: "success", label: "Hoàn thành" },
        //     { value: "processing", label: "Đang nhận diện" },
        //     { value: "null", label: "Chưa nhận diện" },
        //   ],
        // },
      },
      {
        headerName: t("field.action"),
        field: "action",
        pinned: "right",
        minWidth: 200,
        cellRenderer: ActionCellRender,
        cellRendererParams: {
          onUpdateItem: (item: IBangDiem) => {
            setData(item);
            setShowModalEdit(true);
          },
          onDeleteItem: (item: IBangDiem) => {
            setData(item);

            setIsModalDelete(true);
          },
          onCongBo: (item: IBangDiem) => {
            setData(item);
            setOpenCongBoModal(true);
          },
          onTuDongNhap: (item: IBangDiem) => {
            setData(item);
            setOpenTuDongNhapModal(true);
          },
          tooltip: {
            detail: t("tooltip.detail"),
            edit: t("tooltip.edit"),
            delete: t("tooltip.delete"),
            congBo: t("tooltip.congBo"),
            tuDongNhap: t("tooltip.tuDongNhap")
          }
        },
        filter: false
      }
    ]);
  }, [kiHoc, dotThi]);

  const OnCloseModal = useCallback((modaltype: "congBo" | "tuDongNhap") => {
    if (modaltype === "congBo") {
      setOpenCongBoModal(false);
    } else {
      setOpenTuDongNhapModal(false);
    }
  }, []);
  // const handleDownloadFile = () => {
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = "public/download/diem-mau.zip";
  //   downloadLink.download = "diem-mau.zip";
  //   downloadLink.click();
  // };
  return (
    <>
      {contextholder}
      <BaseTable
        key={keyRender}
        columns={columnDefs}
        api={bangDiemApi.list}
        gridOption={{ defaultColDef: defaultColDef }}
      ></BaseTable>
      <DoubleCheckDeleteModal
        openModal={isModalDelete}
        translation="danh-sach-bang-diem"
        closeModal={setIsModalDelete}
        name={data?.ten_hp}
        apiDelete={() => data && bangDiemApi.delete(data)}
        setKeyRender={setKeyRender}
      />
      <CongBoModal
        openModal={openCongBoModal}
        closeModal={OnCloseModal}
        setKeyRender={setKeyRender}
        data={data}
        callnofi={callnofi}
        api={bangDiemApi.congBo}
        translation="danh-sach-bang-diem"
      />
      <TuDongNhapModal
        openModal={openTuDongNhapModal}
        closeModal={OnCloseModal}
        setKeyRender={setKeyRender}
        callnofi={callnofi}
        translation="danh-sach-bang-diem"
        data={data}
        user={authUser}
      />
      <BangDiemEditor
        showModalEdit={showModalEdit}
        setShowModalEdit={setShowModalEdit}
        setKeyRender={setKeyRender}
        data={data}
      />
    </>
  );
};

const DanhSachBangDiemMobile: FC<{
  kiHoc: string[];
  kiHienGio: string;
}> = ({ kiHoc, kiHienGio }) => {
  const { t } = useTranslation("danh-sach-bang-diem");
  const [dataSource, setDataSource] = useState<IBangDiem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [data, setData] = useState<IBangDiem>();
  const [keyRender, setKeyRender] = useState(0);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [callnofi, contextholder] = notification.useNotification();
  const authUser = useAppSelector(getAuthUser);
  const [openTuDongNhapModal, setOpenTuDongNhapModal] = useState(false);
  const [openCongBoModal, setOpenCongBoModal] = useState(false);
  const { format: formatDotThi } = useLoaiLopThi();

  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const [pagination, setPagination] = useState<Paginate>({
    count: 1,
    hasMoreItems: true,
    itemsPerPage: 10,
    page: 1,
    total: 1,
    totalPage: 1
  });
  const getData = useCallback(async (filter: any) => {
    setLoading(true);
    try {
      const res = await bangDiemApi.list(filter);
      if (res.data.list?.length > 0) {
        setDataSource(res.data.list);
        setPagination((state) => {
          return {
            ...state,
            total: res.data.pagination.total
          };
        });
      } else {
        setDataSource([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = useCallback(
    (current: number, pageSize: number) => {
      setPagination((state) => {
        return {
          ...state,
          itemsPerPage: pageSize,
          page: current
        };
      });
    },
    []
  );
  const handleFieldChanged = (field: string, value: any) => {
    form.setFieldsValue({ [field]: value });
    onSubmit(form.getFieldsValue());
  };
  const onSubmit = useCallback(
    (filter: any) => {
      const sendData = {
        filterModel: {
          ki_hoc: {
            filterType: "text",
            type: "contains",
            filter: filter.ki_hoc
          },
          ma_hp: {
            filterType: "text",
            type: "contains",
            filter: filter.ma_hp
          },
          ten_hp: {
            filterType: "text",
            type: "contains",
            filter: filter.ten_hp
          },
          ki_thi: {
            filterType: "text",
            type: "contains",
            filter: filter.ki_thi
          }
        },
        count: 1,
        hasMoreItems: true,
        itemsPerPage: pagination.itemsPerPage,
        page: pagination.page,
        total: 1,
        totalPage: 1
      };
      getData(sendData);
    },
    [pagination.itemsPerPage, pagination.page]
  );

  useEffect(() => {
    form.setFieldsValue({ ki_hoc: kiHienGio });
    onSubmit({ ki_hoc: kiHienGio });
  }, []);

  useEffect(() => {
    onSubmit(form.getFieldsValue());
  }, [pagination.itemsPerPage, pagination.page, keyRender]);
  const OnCloseModal = useCallback((modaltype: "congBo" | "tuDongNhap") => {
    if (modaltype === "congBo") {
      setOpenCongBoModal(false);
    } else {
      setOpenTuDongNhapModal(false);
    }
  }, []);
  const Filter = (
    <Form
      form={form}
      layout="vertical"
      {...layout}
      labelWrap
      onFinish={onSubmit}
      initialValues={{
        ki_hoc: kiHienGio
      }}
    >
      <Row>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ki_hoc"
            label="Kì học"
          >
            <Select onChange={(value) => handleFieldChanged("ki_hoc", value)}>
              {kiHoc.map((item) => (
                <Select.Option key={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ma_hp"
            label="Mã học phần"
          >
            <Input
              onChange={(e) => handleFieldChanged("ma_hp", e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ten_hp"
            label="Tên học phần"
          >
            <Input
              onChange={(e) => {
                handleFieldChanged("ten_hp", e.target.value);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ki_thi"
            label="Đợt thi"
          >
            <Input
              onChange={(e) => handleFieldChanged("ki_thi", e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  let Content = undefined;
  if (loading) {
    Content = (
      <div className="p-2">
        {" "}
        <Spin />{" "}
      </div>
    );
  } else if (dataSource.length == 0) {
    Content = (
      <div className="p-2 text-center"> Giáo viên chưa có bảng điểm nào </div>
    );
  } else {
    Content = (
      <>
        {contextholder}
        {dataSource.map((record, key) => {
          return (
            <Col span={24} key={record.id} className="my-2">
              <Card>
                <p className="my-1">
                  <strong>STT:</strong> {key + 1}
                </p>
                <p className="my-1">
                  <strong>Mã học phần:</strong> {record.ma_hp}
                </p>
                <p className="my-1">
                  <strong>Tên học phần:</strong> {record.ten_hp}
                </p>
                <p className="my-1">
                  <strong>Kì học:</strong> {record.ki_hoc}
                </p>
                <p className="my-1">
                  <strong>Đợt thi:</strong> {formatDotThi(record.ki_thi)}
                </p>
                <p className="my-1">
                  <strong>Loại:</strong> {record.loai}
                </p>
                <p className="my-1">
                  <strong>Ghi chú:</strong> {record.ghi_chu}
                </p>
                <p className="my-1">
                  <strong>Ngày công khai: </strong> {record.ngay_cong_khai}
                </p>
                <p className="my-1">
                  <strong>Ngày kết thúc phúc khảo: </strong>{" "}
                  {record.ngay_ket_thuc_phuc_khao}
                </p>
                <p className="my-1">
                  <strong>Trạng thái nhận diện: </strong>
                  {StatusCellRender(record)}
                </p>
                <div className="flex justify-center">
                  <Tooltip title={t("tooltip.edit")}>
                    <Button
                      shape="circle"
                      icon={<EditOutlined />}
                      type="text"
                      onClick={() => {
                        setData(record);
                        setShowModalEdit(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={t("tooltip.delete")}>
                    <Button
                      shape="circle"
                      icon={<DeleteOutlined />}
                      type="text"
                      onClick={() => {
                        setData(record);
                        setIsModalDelete(true);
                      }}
                    />
                  </Tooltip>

                  <Tooltip title={t("tooltip.tuDongNhap")}>
                    {record.loai == "nhap_tay" ? (
                      <Button shape="circle" type="text" disabled>
                        T
                      </Button>
                    ) : (
                      <Button
                        shape="circle"
                        type="text"
                        onClick={() => {
                          setData(record);
                          setOpenTuDongNhapModal(true);
                        }}
                      >
                        T
                      </Button>
                    )}
                  </Tooltip>
                  <Tooltip title={t("tooltip.congBo")}>
                    <Button
                      shape="circle"
                      onClick={() => {
                        setData(record);
                        setOpenCongBoModal(true);
                      }}
                      type="text"
                    >
                      C
                    </Button>
                  </Tooltip>
                  <Tooltip title={t("tooltip.detail")}>
                    {record.loai == "nhap_tay" ? (
                      <Link to={"" + record.id + "/danh-sach-lop-thi"}>
                        <Button shape="circle" type="text">
                          <i className="fa-solid fa-chevron-right"></i>
                        </Button>
                      </Link>
                    ) : (
                      <Link to={"" + record.id}>
                        <Button shape="circle" type="text">
                          <i className="fa-solid fa-chevron-right"></i>
                        </Button>
                      </Link>
                    )}
                  </Tooltip>
                </div>
              </Card>
            </Col>
          );
        })}

        <div
          className="flex-grow-0"
          style={{
            padding: " 8px 0"
          }}
        >
          <Pagination
            current={pagination.page}
            pageSize={pagination.itemsPerPage}
            showSizeChanger
            onChange={onShowSizeChange}
            total={pagination.total}
          />
        </div>
      </>
    );
  }

  return (
    <div>
      {Filter}
      <div className="card-container card-chi-tiet-diem-danh">
        {Content}
        <DoubleCheckDeleteModal
          openModal={isModalDelete}
          translation="danh-sach-bang-diem"
          closeModal={setIsModalDelete}
          name={data?.ten_hp}
          apiDelete={() => data && bangDiemApi.delete(data)}
          setKeyRender={setKeyRender}
        />
        <CongBoModal
          openModal={openCongBoModal}
          closeModal={OnCloseModal}
          setKeyRender={setKeyRender}
          data={data}
          callnofi={callnofi}
          api={bangDiemApi.congBo}
          translation="danh-sach-bang-diem"
        />
        <TuDongNhapModal
          openModal={openTuDongNhapModal}
          closeModal={OnCloseModal}
          setKeyRender={setKeyRender}
          callnofi={callnofi}
          translation="danh-sach-bang-diem"
          data={data}
          user={authUser}
        />
        <BangDiemEditor
          showModalEdit={showModalEdit}
          setShowModalEdit={setShowModalEdit}
          setKeyRender={setKeyRender}
          data={data}
        />
      </div>
    </div>
  );
};
const ActionCellRender: FC<any> = ({
  onTuDongNhap,
  onCongBo,
  onUpdateItem,
  onDeleteItem,
  data,
  tooltip
}) => {
  if (!data) {
    return <span></span>;
  }

  const loai = data.loai;
  return (
    <>
      <Tooltip title={tooltip.edit}>
        <Button
          shape="circle"
          icon={<EditOutlined />}
          type="text"
          onClick={() => onUpdateItem(data)}
        />
      </Tooltip>
      <Tooltip title={tooltip.delete}>
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          type="text"
          onClick={() => onDeleteItem(data)}
        />
      </Tooltip>
      <Tooltip title={tooltip.tuDongNhap}>
        {loai == "nhap_tay" ? (
          <Button shape="circle" type="text" disabled>
            T
          </Button>
        ) : (
          <Button
            shape="circle"
            type="text"
            onClick={() => {
              onTuDongNhap(data);
            }}
          >
            T
          </Button>
        )}
      </Tooltip>
      <Tooltip title={tooltip.congBo}>
        <Button
          shape="circle"
          onClick={() => {
            onCongBo(data);
          }}
          type="text"
        >
          C
        </Button>
      </Tooltip>
      <Tooltip title={tooltip.detail}>
        {loai == "nhap_tay" ? (
          <Link to={"" + data.id + "/danh-sach-lop-thi"}>
            <Button shape="circle" type="text">
              <i className="fa-solid fa-chevron-right"></i>
            </Button>
          </Link>
        ) : (
          <Link to={"" + data.id}>
            <Button shape="circle" type="text">
              <i className="fa-solid fa-chevron-right"></i>
            </Button>
          </Link>
        )}
      </Tooltip>
    </>
  );
};

const StatusCellRender: FC<any> = ({ data }) => {
  switch (data?.trang_thai_nhan_dien) {
    case "success":
      return <Tag color="#87d068">Hoàn thành</Tag>;
    case "processing":
      return <Tag color="#f50">Đang nhận diện</Tag>;
    case "failed":
      return <Tag color="error">Lỗi trong quá trình nhận diện</Tag>;
    default:
      return <Tag>Chưa nhận diện</Tag>;
  }
};

interface Props {
  openModal: boolean;
  closeModal: (modaltype: "congBo" | "tuDongNhap") => any;
  setKeyRender: (value: number) => any;
  api?: (data: any) => Promise<any>;
  callnofi: NotificationInstance;
  data?: { [index: string]: any };
  translation: string;
  user_id?: number;
  user?: User;
}

const CongBoModal = ({
  openModal,
  translation,
  api,
  closeModal,
  setKeyRender,
  callnofi,
  data
}: Props) => {
  const { t } = useTranslation(translation);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (value: any) => {
    // setloading(true);

    api &&
      (await api({
        ngay_cong_khai: dayjs(value.ngay_cong_khai).format("YY-M-D").toString(),
        ngay_ket_thuc_phuc_khao: dayjs(value.ngay_ket_thuc_phuc_khao)
          .format("YY-M-D")
          .toString(),
        id: data?.["id"]
      })
        .then(() => {
          callnofi.success({
            message: "Thành Công",
            description: "Công bố điểm thành công"
          });
        })
        .catch((err) => {
          callnofi.error({
            message: "Thất bại",
            description: err?.response.data.message || "Công bố điểm Thất bại"
          });
        })
        .finally(() => {
          setloading(false);
          setKeyRender(Math.random());
          closeModal("congBo");
        }));
  };

  useEffect(() => {
    form.setFieldsValue({
      ngay_cong_khai:
        data?.["ngay_cong_khai"] && dayjs(data?.["ngay_cong_khai"]),
      ngay_ket_thuc_phuc_khao:
        data?.["ngay_ket_thuc_phuc_khao"] &&
        dayjs(data?.["ngay_ket_thuc_phuc_khao"])
    });
  }, [data]);

  return (
    <>
      <Modal
        open={openModal}
        onCancel={() => {
          closeModal("congBo");
        }}
        centered
        title={t("title.congBo")}
        destroyOnClose
        footer={<></>}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="flex flex-col md:flex-row">
            <Form.Item
              className="flex-1 mx-2"
              name="ngay_cong_khai"
              label={t("field.ngay_cong_khai")}
              rules={[{ required: true }]}
            >
              <DatePicker format={"DD/MM/YYYY"} className="w-full" allowClear />
            </Form.Item>
            <Form.Item
              className="flex-1 mx-2 "
              name="ngay_ket_thuc_phuc_khao"
              label={t("field.ngay_ket_thuc_phuc_khao")}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("ngay_cong_khai") < value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Ngày kết thúc không được phép bé hơn ngày công khai"
                      )
                    );
                  }
                })
              ]}
            >
              <DatePicker format={"DD/MM/YYYY"} className="w-full" allowClear />
            </Form.Item>
          </div>
          <Form.Item>
            <div className="flex justify-end">
              <Button
                className="mx-1"
                onClick={() => {
                  closeModal("congBo");
                }}
              >
                {t("action.cancel")}
              </Button>
              <Button
                className="mx-1"
                loading={loading}
                type="primary"
                htmlType="submit"
              >
                {t("action.accept")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const TuDongNhapModal = ({
  openModal,
  translation,
  closeModal,
  data,
  setKeyRender,
  callnofi,
  user
}: Props) => {
  const { t } = useTranslation(translation);
  const [loading, setloading] = useState(false);
  const onFinish = async () => {
    setloading(true);
    try {
      await bangDiemApi.nhandienDiem({
        ...data,
        url_origin: `${location.origin}`,
        user: user
      });
      // callnofi.info({
      //   message: "Thông báo",
      //   description: "Hiện tính năng này chưa hoàn thiện",
      //   duration: 2,
      // });
      callnofi.success({
        message: "Thành Công",
        description: "Đang nhận diện điểm"
      });
    } catch (err: any) {
      callnofi.error({
        message: "Thất bại",
        description:
          err?.response.data.message || "Không thể thực hiện hành động"
      });
    } finally {
      setloading(false);
      setKeyRender(Math.random());
      closeModal("tuDongNhap");
    }
  };
  return (
    <Modal
      title={t("title.tuDongNhap")}
      centered
      open={openModal}
      confirmLoading={loading}
      onCancel={() => {
        closeModal("tuDongNhap");
      }}
      cancelText={t("action.cancel")}
      okText={t("action.accept")}
      onOk={onFinish}
    >
      <div>Bạn chắn chắn muốn tự động nhập bảng này ?</div>
    </Modal>
  );
};

const DateFormat: FC<any> = (data, key: string) => {
  if (!data) {
    return <span> </span>;
  }

  let date: any;
  if (data[key]) date = moment(data[key]).format("DD/MM/YYYY");
  return <>{<span>{date}</span>}</>;
};
export interface LoaiCellRendererParams extends ICellRendererParams {
  format: (value: string) => string;
}
const loaiCellRenderer: FC<LoaiCellRendererParams> = (params) => {
  if (!params.value) {
    return "";
  }
  if (!params.format) {
    return "";
  }

  return params.format(params.value);
};
