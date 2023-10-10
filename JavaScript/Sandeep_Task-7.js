/* Formatting function for row details - modify as you need */
function format(d) {
    let productTable = `<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">

    <th>Products:</th>
    <th>Product name:</th>
    <th>Product Price :</th>
    <th>Product Discount:</th>
    <th>Final Price:</th>
    <th>Product Type:</th>
    
    <tbody>`
    // <th>Payment Status:</th>
    let productEntry = "";
    // `d` is the original data object for the row
    //   <td>${d.Products[p]._id} </td> 
    for (let p = 0; p < d.Products.length; p++) {

        // console.log(p);
        productEntry +=
            `<tr>
            <td></td> 
        <td>${d.Products[p].productName}</td> 
        <td>${d.Products[p].productType}</td>
        <td>${d.Products[p].productPrice}</td> 
        <td>${d.Products[p].productDiscount}</td> 
        <td>${d.Products[p].productFinalPrice}</td>
       
        </tr> 
      `
        //  <td>${d.Products[p].userDetails}</td>
    }
    productEntry += "</tbody></table>"
    productTable += productEntry
    return (productTable)


}

// This script file create  for customer form 
console.log("Customers List");
var objectArray = [];
let table = null
$(document).ready(function () {
    table = $('#example').DataTable({
        ajax: {
            type: "GET",
            url: "http://192.168.0.76:1200/api/getAllUser",
            dataSrc: 'data'

        },

        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: 'firstName' },
            { data: 'lastName' },
            { data: 'dateOfBirth' },
            { data: 'contactNumber' },
            { data: 'email' },
            { data: 'address' },
            {
                "mData": null,
                "mSortable": false,
                "mRender": function (R) {
                    return `<button type="button" class="btn btn-primary btn-sm me-2 btn-edit"  data-target="#exampleModal" data-toggle="modal"   id="${R._id}" onclick="editRow(this)">Edit</button>
                   <button type="button" onclick="deleteRow('${R._id}')" id="editRow${R._id}" class="btn btn-danger btn-sm btn-delete">Del</button>`
                }    
            }

        ],
    });
    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
});


// ------------------------------------------------------------------------------------- 


// Summit function create here 
function submitBtn() {
    var object = [];
    // document.getElementById("Submit").style.display = "block";
    //         document.getElementById("Update").style.display = "none";
    if (!validateForm()) {
        return
    }

    var firstName = document.getElementById("firstname").value;
    var lastName = document.getElementById("lastname").value;
    var dateOfBirth = document.getElementById("dob").value;
    var contactNumber = document.getElementById("mobile").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("address").value;

    console.log(R);

    for (let i = 0; i < R; i++) {
        console.log("aa raha hunnn");
        var productName = document.getElementById(`name${i}`).value;
        var productType = document.getElementById(`type${i}`).value;
        var productPrice = document.getElementById(`price${i}`).value;
        var productDiscount = document.getElementById(`discount${i}`).value;
        var productFinalPrice = document.getElementById(`finalprice${i}`).value;
        // var userDetails = document.getElementById(`status${i}`);
        if (productName) {
            let fieldsData = {
                // "Id": i + 1,
                productName: productName,
                productType: Number(productType),
                productPrice: Number(productPrice),
                productDiscount: Number(productDiscount),
                productFinalPrice: Number(productFinalPrice),
                // "userDetails": Number(userDetails.value)
            }
            object.push(fieldsData);
            console.log(object);
        }
        // document.getElementById("formId").reset();
    }

    fetch("http://192.168.0.76:1200/api/addUser", {
        method: "POST",
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            contactNumber: contactNumber,
            email: email,
            address: address,
            Products: object
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));


    setTimeout(() => {
        $("#example").DataTable().ajax.reload()
        console.log("huaa");
    }, 200);



}

// --------------------------------------------------------------------- 
//  DELETE from row data function create here 
function deleteRow(R) {
    console.log(R);
    let t = "are you sure to delet  this data?"
    if (confirm(t) == true) {
        fetch("http://192.168.0.76:1200/api/deleteUserbyId/" + R, {

            method: 'DELETE',
        })
            .then(res => res.json())
            .then(res => console.log(res));
        setTimeout(() => {
            $('#example').DataTable().ajax.reload()
        }, 200);
    }
}

// ------------------------------------------------------------------------------------------- 
//    Edit button create here 
function openForm(){
    document.getElementById('footer').innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button class="btn btn-success" id="Submit" onclick="submitBtn()"> Submit </button>`
   document.getElementById("formId").reset();

}


let u,Edit
function editRow(e) {
    Edit = e.id

    $('#exampleModal').modal('show')
    fetch('http://192.168.0.76:1200/api/userById/' + Edit, {
        method: 'GET',
    }).then((response) => response.json())
        .then((data) => {
            // i = 2
            // document.getElementById("buttonsave").innerHTML = null
            // document.getElementById("Update").style.display = "block";

            document.getElementById('firstname').value = data.data[0].firstName
            document.getElementById('lastname').value = data.data[0].lastName
            document.getElementById('dob').value = data.data[0].dateOfBirth.slice(0, 10)
            document.getElementById('mobile').value = data.data[0].contactNumber
            document.getElementById('email').value = data.data[0].email
            document.getElementById('address').value = data.data[0].address

            if (data.data[0].Products) {

                document.getElementById('name0').value = data.data[0].Products[0].productName
                document.getElementById('type0').value = data.data[0].Products[0].productType
                document.getElementById('price0').value = data.data[0].Products[0].productPrice
                document.getElementById('discount0').value = data.data[0].Products[0].productDiscount
                document.getElementById('finalprice0').value = data.data[0].Products[0].productFinalPrice

                document.getElementById('name1').value = data.data[0].Products[1].productName
                document.getElementById('type1').value = data.data[0].Products[1].productType
                document.getElementById('price1').value = data.data[0].Products[1].productPrice
                document.getElementById('discount1').value = data.data[0].Products[1].productDiscount
                document.getElementById('finalprice1').value = data.data[0].Products[1].productFinalPrice

                for (let S = 2; S < data.data[0].Products.length; S++) {

                    AddRow()
                    document.getElementById('name' + S).value = data.data[0].Products[S].productName
                    document.getElementById('type' + S).value = data.data[0].Products[S].productType
                    document.getElementById('price' + S).value = data.data[0].Products[S].productPrice
                    document.getElementById('discount' + S).value = data.data[0].Products[S].productDiscount
                    document.getElementById('finalprice' + S).value = data.data[0].Products[S].productFinalPrice
                    // document.getElementById('paymentStatus' + f).value = data.data[0].Products[f].userDetails

                }

            }
            

        })

        document.getElementById('footer').innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-success" onclick=update() id="Update" data-dismiss="modal">Update</button>`
    document.getElementById("formId").reset();
}
// ------------------------------------------------------ 


// ------------------------------------------------------------------------------------------------------------------ 
//   Update details function create here 

// From This Function we can update the values in arr and show the updated values

function update() {

            object=[]
            firstName = document.getElementById('firstname').value;
            lastName = document.getElementById('lastname').value;
            dob = document.getElementById('dob').value;
            mobile = document.getElementById('mobile').value;
            email = document.getElementById('email').value;
            address = document.getElementById('address').value;
        
            //   var  K=0;
            for (let i = 0; i < R; i++) {
                productName = document.getElementById(`name${i}`).value;
                productType = document.getElementById(`type${i}`).value;
                productPrice = document.getElementById(`price${i}`).value;
                productDiscount = document.getElementById(`discount${i}`).value;
                productFinalPrice = document.getElementById(`finalprice${i}`).value;
                // var userDetails = document.getElementById(`status${i}`);
                if (productName) {
                    let fieldsData = {
                        "productName": productName,
                        "productType": Number(productType),
                        "productPrice": Number(productPrice),
                        "productDiscount": Number(productDiscount),
                        "productFinalPrice": Number(productFinalPrice)
                    }
                    object.push(fieldsData);
                    console.log(object);
                }
            }
            document.getElementById("formId").reset();

            fetch("http://192.168.0.76:1200/api/updateUser/" + Edit, {
                method: "PUT",
                body: JSON.stringify(
                    {
                        "firstName":firstName,
                        "lastName":lastName,
                        "dateOfBirth":dob,
                        "contactNumber":mobile,
                        "email":email,
                        "address":address,
                        "Products":object
                    }
                ),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })



            $("#exampleModal").modal('hide')
            setTimeout(() => {
                $('#example').DataTable().ajax.reload()
                
            }, 200);

}
// ------------------------------------------------------------------------------------- 

// del() - function Ceate for Removing products fields.
function Del(e) {
    e.parentNode.parentNode.remove();

}

// ------------------------------------------------------------------------ 
// Validation function create here for customer form
function validateForm() {
    var a = true;
    var firstName = document.getElementById("firstname").value;
    var lastName = document.getElementById("lastname").value;
    var dateOfBirth = document.getElementById("dob").value;
    var contactNumber = document.getElementById("mobile").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("address").value;

    // First Name Valdation 
    var regName = /^[a-zA-Z]+$/;
    var firstName = document.getElementById('firstname').value;
    if (!regName.test(firstName)) {
        document.getElementById("vfname").innerHTML = 'Invalid first name given.';
        a = false;
    } else {
        document.getElementById("vfname").innerHTML = "";
    }
    // Last Name Validation 
    var regName = /^[a-zA-Z]+$/;
    var lastName = document.getElementById('lastname').value;
    if (!regName.test(lastName)) {
        document.getElementById("vlname").innerHTML = 'Invalid last name given.';
        a = false;
    } else {
        document.getElementById("vlname").innerHTML = "";
    }

    // Date of Birth Valdation 
    if (dateOfBirth == "") {

        document.getElementById("vdob").innerHTML = "DOB is required";
        a = false;
    } else {
        document.getElementById("vdob").innerHTML = "";
    }
    //Mobile Valdation 
    if (contactNumber == "") {
        document.getElementById("vmobile").innerHTML = "Mobile no. is required";
        a = false;
    }
    else {
        document.getElementById("vmobile").innerHTML = "";
    }

    //Email Valdation 
    if (email == "") {
        document.getElementById("vemail").innerHTML = "Email is required";
        a = false;
    }
    else if (!email.includes("@")) {
        document.getElementById("vemail").innerHTML = "Invalid email address ";
        a = false;
    } else {
        document.getElementById("vemail").innerHTML = "";
    }
    //Mobile Valdation 
    if (address == "") {

        document.getElementById("vaddress").innerHTML = "Address is required";
        a = false;
    } else {
        document.getElementById("vaddress").innerHTML = "";
    }

    for (let i = 0; i <= R; i++) {
        var productName = document.getElementById(`name${i}`);
        var productPrice = document.getElementById(`price${i}`);
        var productDiscount = document.getElementById(`discount${i}`);
        var productFinalPrice = document.getElementById(`finalprice${i}`);
        var productType = document.getElementById(`type${i}`);
        // var userDetails = document.getElementById(`status${i}`);
        if (productName) {
            // Product Name Validation 
            var regName = /^[a-zA-Z]+$/;
            var productName = document.getElementById(`name${i}`).value;
            if (!regName.test(productName)) {
                document.getElementById(`vname${i}`).innerHTML = "Name is required";
                a = false;
            } else {
                document.getElementById(`vname${i}`).innerHTML = "";
            }

            // Product price validation 
            if (productPrice.value == "") {
                document.getElementById(`vprice${i}`).innerHTML = "Price is required";
                a = false;
            } else {
                document.getElementById(`vprice${i}`).innerHTML = "";
            }

            // product discount validation 
            if (productDiscount.value == "") {
                document.getElementById(`vdiscount${i}`).innerHTML = " required";
                a = false;
            } else {
                document.getElementById(`vdiscount${i}`).innerHTML = "";
            }

            //  final price validation 
            if (productFinalPrice.value == "") {
                document.getElementById(`vfinalprice${i}`).innerHTML = "Final Price required";
                a = false;
            } else {
                document.getElementById(`vfinalprice${i}`).innerHTML = "";
            }
            // product type validation 

            if (productType.value == "") {
                document.getElementById(`vtype${i}`).innerHTML = "Type is required";
                a = false;
            } else {
                document.getElementById(`vtype${i}`).innerHTML = "";
            }


        }
    }
    return a;
}

// ------------------------------------------------------------------------------------------------- 

// addrow()  function create for adding products

var R = 2;
function AddRow() {
    const fields = document.createElement(`div`);
    fields.className = "";
    fields.innerHTML = ` 
    <!-- Second default product field  -->
    <div class="row me-2  product">
        <!-- Product name inter field  -->
        <div class="form-group col-md-2 mb-3">
            <label for="name"></label>
            <input type="text" name="product_name" class="form-control name" id="name${R}" placeholder="Car" pattern="/^[a-zA-Z]+$/" required>
            <small id="vname${R}"></small>
        </div>
        <!-- Product Price inter here  -->
        <div class="form-group col-md-2 mb-3">
            <label for="price"></label>
            <input type="number" name="Price" class="form-control price" id="price${R}" placeholder="200000000₹" required>
            <small id="vprice${R}"></small>
        </div>
        <!-- Discount field add here  -->
        <div class="form-group col-md-2 mb-3">
            <label for="discount"></label>
            <input type="number" name="discount" class="form-control discount" id="discount${R}" placeholder="18%" required>
            <small id="vdiscount${R}"></small>
        </div>
        <!-- Final Price add here  -->
        <div class="form-group col-md-2 mb-3">
            <label for="final price"></label>
            <input type="number" name="final_price" class="form-control finalPrice" id="finalprice${R}"
                placeholder="Enter Final Price" required>
                <small id="vfinalprice${R}"></small>
        </div>
        <!-- Product type add here  -->
        <div class="form-group col-md-2 mb-3">
            <div class="mb-3">
                <label for="product type" class="form-label"></label>
                <select class="form-select form-select-sm productType" id="type${R}" name="product_type" required>
                    <option value="" >Select Type</option>
                    <option value="1">Electronics</option>
                    <option value="2">Cosmatics</option>
                    <option value="3">Grocery</option>
                    
                </select>
                <small id="vtype${R}"></small>
            </div>

        </div>
        <!-- Product Status field create here  -->
       
        <div class="form-group col-md-1 but">
          <button type="button" onclick="Del(this);" class="btn btn-danger mt-3 ">Delete</button>
        </div>
    </div>     
    `
    R++;
    const maindiv = document.getElementById("field");
    maindiv.appendChild(fields);

}
// ------------------------------------------------------------------------------


