import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Form, Input, message, Rate, Row, Select, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import './App.css'

interface DataType {
  key: string | number
  id: number
  name: string
  rate: number
  description: string
}

const options = [
  {
    value: 1,
    option: '1'
  },
  {
    value: 2,
    option: '2'
  },
  {
    value: 3,
    option: '3'
  },
  {
    value: 4,
    option: '4'
  },
  {
    value: 5,
    option: '5'
  }
]

type formType = {
  name: string
  description: string
  rate: number
}
function App() {
  const [form] = Form.useForm<formType>()
  const [dataSource, setDataSource] = useState<DataType[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [isDataEdit, setDataEdit] = useState<any>(undefined)
  const column: ColumnsType<DataType> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'đánh giá',
      dataIndex: 'rate',
      key: 'rate',
      render: (value) => {
        return <Rate defaultValue={value} disabled />
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={8} align='center'>
            <Button danger onClick={() => setDataSource(dataSource.filter((item) => item.id !== record.id))}>
              Xóa
            </Button>
            <Button type='primary' onClick={() => setDataEdit(record)}>
              Chỉnh sửa
            </Button>
          </Flex>
        )
      }
    }
  ]
  const onSubmit = async (values: formType) => {
    await form.validateFields()
    if (isDataEdit) {
      setDataSource(dataSource.map((item) => (item.id === isDataEdit.id ? { ...item, ...values } : item)))
      form.resetFields()
      setDataEdit(undefined)
      message.success('Chỉnh sửa thành công')
      return
    }
    const id = Date.now()
    setDataSource((prev) => [...prev, { ...values, key: id, id }])
    message.success('Thêm mới thành công')
    form.resetFields()
  }

  useEffect(() => {
    if (isDataEdit) {
      form.setFieldsValue(isDataEdit)
    }
  }, [isDataEdit])

  return (
    <Flex vertical gap={16} className='w-full !p-6' align='start'>
      <Flex className='w-full' justify='space-between' wrap='wrap'>
        <Typography className='text-xl font-medium text-red-500'>TEST GIAO DIỆN</Typography>
        <Button onClick={() => form.submit()} icon={<PlusOutlined />}>
          Thêm
        </Button>
      </Flex>
      <Form form={form} onFinish={onSubmit} layout='vertical' className='w-full'>
        <Row gutter={[16, 16]}>
          <Col {...{ xs: { span: 24 }, lg: { span: 6 } }}>
            <Form.Item label='Tên' name='name'>
              <Input />
            </Form.Item>
          </Col>

          <Col {...{ xs: { span: 24 }, lg: { span: 6 } }}>
            <Form.Item label='Mô tả' name='description'>
              <Input />
            </Form.Item>
          </Col>

          <Col {...{ xs: { span: 24 }, lg: { span: 6 } }}>
            <Form.Item label='Đánh giá' name='rate'>
              <Select options={options} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table scroll={{ x: 1500 }} columns={column} dataSource={dataSource} pagination={false} />
    </Flex>
  )
}

export default App
