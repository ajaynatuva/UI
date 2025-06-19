import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CustomHeader from '../../components/CustomHeaders/CustomHeader'
import Template from '../../components/Template/Template'
import { UserState } from '../../redux/reducers/UserReducer/UserReducer';
import '../NotFound/NotFound.css';

const NotFoundPage = () => {
  const roleState: UserState = useSelector((state: any) => state.userReducer);


  return (
    <div>
      <Template>
      <CustomHeader className="head"
          labelText={'No Page Found'}
        />
      </Template>
    </div>
  )
}

export default NotFoundPage