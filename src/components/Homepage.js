import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, ButtonGroup } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { db, storage } from "../firebase";

const useButtonStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles({
  table: {
    minWidth: 900,
    marginTop: 100,
  },
});

const Homepage = () => {
  const classes = useStyles();
  const buttonStyles = useButtonStyles();
  const history = useHistory();

  const [users, setUsers] = useState([]);

  /// useEffect -> runs a piece of code baded on a specific condition
  useEffect(() => {
    // this is where the code runs
    db.collection("users").onSnapshot((snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, user: doc.data() })));
    });
  }, []);

  const handleDelete = (userId, userImage) => {
    const storageRef = storage.ref("images/");
    const imageRef = storageRef.child(userImage);
    imageRef
      .delete()
      .then(() => {
        console.log("Document Storage successfully deleted!");
        db.collection("users")
          .doc(userId)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <div>
        <div className={buttonStyles.root}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => history.push("/addUser")}
          >
            Add User
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="center">Pic</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Contact</StyledTableCell>
                <StyledTableCell align="center">Address</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell component="th" scope="row">
                    {user.user.userName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <img
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      src={user.user.userImage}
                      alt="userImage"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {user.user.userEmail}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {user.user.userContact}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {user.user.userAddress}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div className={buttonStyles.root}>
                      <ButtonGroup
                        variant="contained"
                        aria-label="contained primary button group"
                      >
                        <Button
                          color="secondary"
                          style={{ marginRight: "5px" }}
                          onClick={() =>
                            handleDelete(user.id, user.user.imageName)
                          }
                        >
                          Delete
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => history.push(`/editUser/${user.id}`)}
                        >
                          Edit
                        </Button>
                      </ButtonGroup>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default Homepage;
