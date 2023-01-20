import React, { useEffect, useState } from 'react'
import IndexPage from "components/layouts/IndexPage"
import { Container, Modal, Card, Button, Form, Image, InputGroup, Row, Col, Table, Pagination, Badge } from 'react-bootstrap'
import MyPagination from "@/components/Pagination"
import useAxios from 'axios-hooks'
import PageLoading from '@/components/PageChange/pageLoading'
import PageError from '@/components/PageChange/pageError'
import ProductsAddModal from '@/container/products/productsAddModal'
import ProductsDeleteModal from '@/container/Products/ProductsDeleteModal'
import ProductsEditModal from '@/container/Products/ProductsEditModal'
function MyTable(props) {
    const [currentItems, setCurrentItems] = useState(props?.data);
    const [numberSet, setNumberSet] = useState(props?.setNum);
    const [typeId] = useState(props?.dataType);
    console.log(typeId);
    useEffect(() => {
        setCurrentItems(currentItems);
        console.log(props);
    }, [props]);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>ภาพ</th>
                    <th>ชื่อสินค่า</th>
                    <th>ประเภทสินค้า</th>
                    <th>ราคา</th>
                    <th>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.length ? (
                    currentItems?.map((item, index) => (
                   
                        <tr key={item.id}>
                            <td>{index + 1 + numberSet}</td>
                            <td>
                                <Image src={item.image}  width="150px" height="150px" className='object-fit-cover' />
                            </td>
                            <td>
                                {item.name}
                            </td>
                            <td>
                                <Badge bg="primary">
                                    {item.productType?.name}
                                </Badge>
                            </td>
                            <td>
                                {item.price}{' '}บาท
                            </td>
                            <td>
                                <ProductsEditModal value={item} getData={props?.getData} />
                                <ProductsDeleteModal value={item} getData={props?.getData} />
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

    const [{ data: productsData, loading, error }, getProduct] = useAxios({ url: `/api/products?page=1&pageSize=10&type=`, method: 'GET' });
    useEffect(() => {
        if (productsData) {
            setParams({
                ...params,
                page: productsData.page,
                pageSize: productsData.pageSize
            });
        }
    }, [productsData]);

    const [{ data: productTypeData }, getProductsType] = useAxios({ url: '../api/productType?' })
    const [typeId, setTypeId] = useState("");
    const [name, setName] = useState("");
   

    const handleSelectPage = (pageValue) => {
        getProduct({ url: `/api/products?page=${pageValue}&pageSize=${params.pageSize}` })
    };
    const handleSelectPageSize = (sizeValue) => {
        getProduct({ url: `/api/products?page=1&pageSize=${sizeValue}` })
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
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>ค้นหาสินค้ส</Form.Label>
                        <form className="d-none d-md-flex ms-4">
                            <input className="form-control bg-dark border-0" type="search" placeholder="Search" onChange={(e) => { setName(e.target.value) }} />
                        </form>  
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>ประเภทสินค้า</Form.Label>
                            <Form.Select 
                            onChange={(e) => { setTypeId(e.target.value) }}
                            value={typeId} >
                             <option value="">ประเภทสินค้า</option>
                            {productTypeData.data?.map((productType, index) => (
                             <option key={index} value={productType.id}>{productType.name}</option>
                            ))} 

                            </Form.Select>
                    </Form.Group>
                    <ProductsAddModal getData={getProduct}/>

                 
                    
                </div>
                <MyTable data={productsData?.data} dataType={typeId} setNum={(productsData?.page * productsData?.pageSize) - productsData?.pageSize} getData={getProduct} />
                <MyPagination page={productsData.page} totalPages={productsData.totalPage} onChangePage={handleSelectPage} pageSize={params.pageSize} onChangePageSize={handleSelectPageSize} />
            </Card >
        </Container >
    );
}
ProductPage.layout = IndexPage