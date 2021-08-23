import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase/app";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { db, storage } from "./../firebase";

const AddInfo = () => {
  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: "100px",
      "& > *": {
        margin: theme.spacing(1),
        width: "45ch",
      },
    },
  }));
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

  const { name, email, contact, address } = state;

  const [image, setImage] = useState(null);

  const [progress, setProgress] = useState(0);

  const handleInputeChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      var src1 = URL.createObjectURL(e.target.files[0]);
      var preview1 = document.getElementById("image-1-preview");
      preview1.src = src1;
      preview1.style.display = "block";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      const imageName = image.name;
      const uploadTask = storage.ref(`images/${imageName}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function .....
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error function...
          console.log(error);
          alert(error.message);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("users").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userName: name,
                userAddress: address,
                userContact: contact,
                userEmail: email,
                userImage: url,
                imageName: imageName,
              });
            });
          setProgress(0);
          setState({
            name: "",
            email: "",
            contact: "",
            address: "",
          });
          setImage(null);
          var preview1 = document.getElementById("image-1-preview");
          preview1.style.display = "none";
        }
      );
    }
  };

  const removeImage = () => {
    var preview1 = document.getElementById("image-1-preview");
    preview1.style.display = "none";
    setImage(null);
  };
  return (
    <>
      <div>
        <Button
          color="primary"
          variant="contained"
          style={{ width: "100px", marginTop: "20px" }}
          type="submit"
          onClick={() => history.push("/")}
        >
          Go back
        </Button>
        <form
          className={classes.root}
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="standard-basic"
            label="Standard"
            name="name"
            value={name}
            type="text"
            onChange={handleInputeChange}
          />
          <br />
          <TextField
            name="email"
            id="standard-basic"
            label="Standard"
            value={email}
            onChange={handleInputeChange}
            type="email"
          />
          <br />
          <TextField
            name="contact"
            id="standard-basic"
            label="Standard"
            value={contact}
            type="number"
            onChange={handleInputeChange}
          />
          <br />
          <TextField
            name="address"
            id="standard-basic"
            label="Standard"
            value={address}
            onChange={handleInputeChange}
            type="text"
          />
          <br />
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          <div className="imagePreview">
            <img onClick={() => removeImage()} id="image-1-preview" alt="" />
            {progress === 0 ? (
              <></>
            ) : (
              <CircularProgress
                className="circularProgress"
                variant="determinate"
                value={progress}
              />
            )}
          </div>
          <Button
            color="primary"
            variant="contained"
            style={{ width: "100px" }}
            type="submit"
          >
            Add User
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddInfo;
