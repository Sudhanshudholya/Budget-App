import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Budget = () => {
  const [amount, setAmount] = useState(0)
  const [type, setType] = useState("")
  const [remark, setRemark] = useState("")
  const [transactions, setTransactions] = useState([])
  const [editTxnId, setEditTxnId] = useState(null)


  const saveTransaction = () => {

    if(amount <= 0 || type == "" || remark == ""){
      if(amount < 0){
        toast("Amount can not be negative")
        return
      }
      toast("all form field are required")
      return
    }

    if(type == "expense"){
      const {income, expense} = getSummary()
      const balance = income - expense

      if(amount > balance){
        toast("invalid transaction amount", {
          pauseOnHover: false,
        })
        return
      }
    }
    setTransactions(txn => [...txn, {id :uuidv4(), amount, type, remark }])
    setAmount(0)
    setType("")
    setRemark("")
  }

  const deleteTxn = (id) => {
    MySwal.fire({
      title: <p>Do You Really Want To Delete ?</p>,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: "Yes Delete",
      icon: 'question'
    }).then(({isConfirmed}) => {
      if(isConfirmed){
        const txns = transactions.filter(txn => txn.id !=id)
        setTransactions(txns)
        return MySwal.fire({
          title: <p>Deleted Successfully</p>,
          icon: 'success'
        })
      }
    })
   
  }

  const editTxn = (id) => {
     setEditTxnId(id)
     const {amount, type, remark} = transactions.find(txn => txn.id == id)
     setAmount(amount)
     setType(type)
     setRemark(remark)
  }

  const updateTxn = () => {
    const txns = transactions.map(txn => {
      if(txn.id == editTxnId){
        return {
          amount, type, remark, id:editTxnId
        }
      }else{
        return txn 
      }
    })

    setTransactions(txns)
    setEditTxnId(null)
    setAmount(0)
    setType("")
    setRemark("")
  }

  const getSummary = () => {

    const summary = {
      income : 0,
      expense: 0,
    }

    transactions.forEach(txn => {
      if(txn.type == "income"){
        summary.income = summary.income + parseFloat(txn.amount)
      }else{
        summary.expense = summary.expense + parseFloat(txn.amount)
      }
    })
    return summary
  }

  return (
    <>
      <h1 text align='center'>Budget App</h1>

      {/* Add Form  */}

     {!editTxnId && <div>
        <input
          type="number"
          placeholder='Enter any amount'
          value={amount}
          onChange={e => setAmount(e.target.value)} />

        <select
          value={type}
          onChange={e => setType(e.target.value)}>
          <option>Select</option>
          <option>income</option>
          <option>expense</option>
        </select>

        <input
          type="text"
          placeholder='Enter any remark'
          value={remark}
          onChange={e => setRemark(e.target.value)} />

        <button onClick={saveTransaction}>Save</button>
      </div>}

      {/* Edit Form  */}

      {editTxnId && <div>
        <input
          type="number"
          placeholder='Enter any amount'
          value={amount}
          onChange={e => setAmount(e.target.value)} />

        <select
          value={type}
          onChange={e => setType(e.target.value)}>
          <option>Select</option>
          <option>income</option>
          <option>expense</option>
        </select>

        <input
          type="text"
          placeholder='Enter any remark'
          value={remark}
          onChange={e => setRemark(e.target.value)} />

        <button onClick={updateTxn}>Update</button>
      </div>}

      <table width={'100%'} border={'1'}>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Type</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(txn => (<tr>
            <td>{txn.amount}</td>
            <td>{txn.type}</td>
            <td>{txn.remark}</td>
            <td>
              <button onClick={() =>deleteTxn(txn.id)}>Delete</button>
              <button onClick={() =>editTxn(txn.id)}>Edit</button>
              </td>
          </tr>))}
        </tbody>
      </table>

     <h2>total income : {getSummary().income}  </h2>
     <h2>total expense : {getSummary().expense} </h2>
     <h2>Balance : {getSummary().income - getSummary().expense}</h2>
      
      
    </>
  )
}

export default Budget


