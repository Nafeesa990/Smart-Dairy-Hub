import { lazy,Suspense } from 'react';
import { Route,Routes } from 'react-router-dom';
import './App.css';

function App() {
  const Hm=lazy(()=>import('./components/home'));
  // const Login=lazy(()=>import('./components/login'));
  const About=lazy(()=>import('./components/about'));
  const Contact=lazy(()=>import('./components/contact'));
  const Dropdown=lazy(()=>import('./components/dropdown'));
  const Userslist=lazy(()=>import('./components/dropdownusers'));
  const Navs=lazy(()=>import('./components/navs'));
  const Admin=lazy(()=>import('./components/admin'));
  const Sign=lazy(()=>import('./components/signup'));
  const Dash=lazy(()=>import('./components/admin pages/dash_main'));
  
  // const Add_Society=lazy(()=>import('./components/add_society'));
  const Dashl=lazy(()=>import('./components/admin pages/dashl'));
  const View_Delivery=lazy(()=>import('./components/admin pages/view_delivery'));
  const View_Payment=lazy(()=>import('./components/admin pages/view_payment'));
  const Feedback=lazy(()=>import('./components/admin pages/feedback'));
 
 
 
 
  const Addproducts=lazy(()=>import('./components/admin pages/add_products'));
  
 
  // const Display=lazy(()=>import('./components/admin pages/display'));
  // const Display_society=lazy(()=>import('./components/admin pages/display_society'));
  const View_Messages=lazy(()=>import('./components/admin pages/view_messages'));
  const Verify=lazy(()=>import('./components/admin pages/verify'));
  const Edit=lazy(()=>import('./components/admin pages/edit_products'));
  const EditForm=lazy(()=>import('./components/admin pages/editform'));
  const Form=lazy(()=>import('./components/admin pages/form'));
  const QualityForm=lazy(()=>import('./components/admin pages/prediction_form'));
  const QualityCheck=lazy(()=>import('./components/admin pages/quality_check'));
  const PredictionResult=lazy(()=>import('./components/admin pages/prediction_results'));
  const AdminPay=lazy(()=>import('./components/admin pages/adminpay'));

  const FarmerDash=lazy(()=>import('./components/Farmers/farmerdash'));
  const FarmerLogin=lazy(()=>import('./components/Farmers/farmerlogin'));
  const FarmerSignin=lazy(()=>import('./components/Farmers/farmersignin'));
  const FarmerForm=lazy(()=>import('./components/Farmers/farmer_form'));
  const SubmittedForm=lazy(()=>import('./components/Farmers/submitted_form'));
  const BankDetails=lazy(()=>import('./components/Farmers/bank_details'));

  // const DashBoard=lazy(()=>import('./components/Board_Members/board_dashboard'));

  const DeliveryDashboard=lazy(()=>import('./components/Employee/deliverydash')); 
  const Displayproducts=lazy(()=>import('./components/Employee/displayproducts'));
  const Delivery=lazy(()=>import('./components/Employee/login'));
  const Orders=lazy(()=>import('./components/Employee/orders'));

  const Dashcustomer=lazy(()=>import('./components/Customer/dashcustomer'))
  const Login=lazy(()=>import('./components/Customer/login'))
  const Signin=lazy(()=>import('./components/Customer/signin'))
  const CusProduct=lazy(()=>import('./components/Customer/cus_product'))
  const ViewMore=lazy(()=>import('./components/Customer/view_more'))
  const Cart=lazy(()=>import('./components/Customer/cart'))
  const Shipping=lazy(()=>import('./components/Customer/shipping_details'))
  const Payment=lazy(()=>import('./components/Customer/payment'))
  const Order=lazy(()=>import('./components/Customer/order'))



  return (
    <div>
      <Suspense fallback={<div>Loading......</div>}>
      <Routes>
        <Route path='/' element={<Hm/>}/>
        <Route path='/Dashl' element={<Dashl/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/Dropdown' element={<Dropdown/>}/>
        <Route path='/Userslist' element={<Userslist/>}/>
        <Route path='/Navs' element={<Navs/>}/>
        <Route path='/Admin' element={<Admin/>}/>
        <Route path='/Sign' element={<Sign/>}/>
        <Route path='/Dash' element={<Dash/>}/>
        <Route path='/AdminPay' element={<AdminPay/>}/>
        <Route path='/View_Delivery' element={<View_Delivery/>}/>
        <Route path='/View_Payment' element={<View_Payment/>}/>
        <Route path='/Feedback' element={<Feedback/>}/>
      
        
        <Route path='/Addproducts' element={<Addproducts/>}/>
        
        
       
        <Route path='/View_Messages' element={<View_Messages/>}/>
        <Route path='/Verify' element={<Verify/>}/>
        <Route path='/Edit' element={<Edit/>}/>
        <Route path='/EditForm' element={<EditForm/>}/>
        <Route path='/Form' element={<Form/>}/>
        <Route path='/QualityForm' element={<QualityForm/>}/>
        <Route path='/QualityCheck' element={<QualityCheck/>}/>
        <Route path='/PredictionResult' element={<PredictionResult/>}/>

        <Route path='/FarmerDash' element={<FarmerDash/>}/> 
        <Route path='/FarmerLogin' element={<FarmerLogin/>}/>
        <Route path='/FarmerSignin' element={<FarmerSignin/>}/>
        <Route path='/FarmerForm' element={<FarmerForm/>}/>
        <Route path='/SubmittedForm' element={<SubmittedForm/>}/>
        <Route path='/BankDetails' element={<BankDetails/>}/>
{/* 
        <Route path='/DashBoard' element={<DashBoard/>}/>*/}

        <Route path='/DeliveryDashboard' element={<DeliveryDashboard/>}/> 
        <Route path='/Displayproducts' element={<Displayproducts/>}/>
        <Route path='/Delivery' element={<Delivery/>}/>
        <Route path='/Orders' element={<Orders/>}/>

        <Route path='/Dashcustomer' element={<Dashcustomer/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Signin' element={<Signin/>}/>
        <Route path='/CusProduct' element={<CusProduct/>}/>
        <Route path='/ViewMore' element={<ViewMore/>}/>
        <Route path='/Cart' element={<Cart/>}/>
        <Route path='/Shipping' element={<Shipping/>}/>
        <Route path='/Payment' element={<Payment/>}/>
        <Route path='/Order' element={<Order/>}/>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
