function Bind(iCount, data) {
    $('#tblEmployees tr:last')
    .after('<tr><td><input type="text" id="txtName' + data[iCount].Id + '" value="' + data[iCount].Name + '"/></td><td><input type="text" id="txtAge' + data[iCount].Id + '" value="' + data[iCount].Age + '"/></td><td><input type="text" id="txtId' + data[iCount].Id + '" value="' + data[iCount].Id + '"/></td><td><input id=btnDelete' + iCount + ' data-id="' + data[iCount].Id + '" type="button" value="delete" /></td><td><input id=btnUpdate' + iCount + ' data-id="' + data[iCount].Id + '" type="button" value="Update" /> <td></tr>');

}