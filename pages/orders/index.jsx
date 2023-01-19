import React, { useEffect, useState } from 'react'
import IndexPage from "components/layouts/IndexPage"
import { Container, Modal, Card, Button, Form, Image, InputGroup, Row, Col, Table, Pagination, Badge } from 'react-bootstrap'
import MyPagination from "@/components/Pagination"
import useAxios from 'axios-hooks'
import PageLoading from '@/components/PageChange/pageLoading'
import PageError from '@/components/PageChange/pageError'
// import OrderAddModal from '@/container/Orders/OrderAddModal'
// import OrderDeleteModal from '@/container/Orders/OrderDeleteModal'
import OrderShowDetailModal  from '@/container/Orders/OrderShowDetailModal'
// import OrderEditModal from '@/container/Orders/OrderEditModal'
function MyTable(props) {
    const [currentItems, setCurrentItems] = useState(props?.data);
    const [numberSet, setNumberSet] = useState(props?.setNum);
    useEffect(() => {
        setCurrentItems(currentItems);
        console.log(props);
    }, [props]);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>ชื่อผู้สั่งสินค้า</th>
                    <th>รายละเอียดที่ต้องจัดส่ง</th>
                    <th>สถานะ</th>
                    <th>ราคารวม</th>
                    <th>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.length ? (
                    currentItems?.map((item, index) => (
                        
                        <tr key={item.id}>
                            <td>{index + 1 + numberSet}</td>
                            <td>
                                {item.firstname}{" "}{item.lastname}
                            </td>
                            <td>
                                 <OrderShowDetailModal value={item} getData={props?.getData} />
                            </td>
                            <td>
                                <Badge bg="primary">
                                    {item.status}
                                </Badge>
                            </td>
                            <td>
                                {item.total}{' '}บาท
                            </td>
                            <td>
                                {/* <OrderConfirmModal value={item} getData={props?.getData} />
                                <OrderDeleteModal value={item} getData={props?.getData} /> */}
                            </td>
                        </tr>
                    )))
                    : ""}
            </tbody>
        </Table>
    );
}

export default function ProductPage() {
    const [params, setParams] = useState({
        page: '1',
        pageSize: '10'
    });

    const [{ data: orderData, loading, error }, getProduct] = useAxios({ url: `/api/order?page=1&pageSize=10`, method: 'GET' });
    useEffect(() => {
        if (orderData) {
            setParams({
                ...params,
                page: orderData.page,
                pageSize: orderData.pageSize
            });
        }
    }, [orderData]);

    const handleSelectPage = (pageValue) => {
        getProduct({ url: `/api/order?page=${pageValue}&pageSize=${params.pageSize}` })
    };
    const handleSelectPageSize = (sizeValue) => {
        getProduct({ url: `/api/order?page=1&pageSize=${sizeValue}` })
    };

    if (loading) {
        return <PageLoading />;
    }
    if (error) {
        return <PageError />;
    }
    return (
        <Container fluid className="pt-4 px-4">
            <Card className="bg-secondary text-center rounded shadow p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <Card.Title className="mb-0">
                        รายการสินค้า
                    </Card.Title>
                    {/* <OrderAddModal getData={getProduct}/> */}
                </div>
                <MyTable data={orderData?.data} setNum={(orderData?.page * orderData?.pageSize) - orderData?.pageSize} getData={getProduct} />
                <MyPagination page={orderData.page} totalPages={orderData.totalPage} onChangePage={handleSelectPage} pageSize={params.pageSize} onChangePageSize={handleSelectPageSize} />
            </Card >
        </Container >
    );
}
ProductPage.layout = IndexPage