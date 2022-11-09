import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { storage } from './firebase';

import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import uuid from 'react-uuid';

function App() {
	const [imageUpload, setImageUpload] = useState(null);
	const [imageList, setImageList] = useState([]);

	const imageListRef = ref(storage, 'product-images/');

	const uploadImage = () => {
		console.log('Upload Image');
		console.log(imageUpload);

		// store the file in the firebase storage
		if (imageUpload == null) return;

		console.log(imageUpload)
		// make image reference to identify which folder in storage we will store the image
		const imageRef = ref(
			storage,
			`product-images/${imageUpload.name + uuid()}`
		);

		uploadBytes(imageRef, imageUpload).then((snapshot) => {
			// alert('Image uploaded');
			getDownloadURL(snapshot.ref).then((url) => {
				// todo,  add this to product image in your mighty jaxx product dashboard project
				console.log(url);
				setImageList((prev) => [...prev, url]);
			});
		});
	};

	useEffect(() => {
		listAll(imageListRef).then((response) => {
			console.log(response);
			response.items.forEach((item) => {
				getDownloadURL(item).then((url) => {
					setImageList((prev) => [...prev, url]);
				});
			});
		});
	}, []);

	return (
		<div className="App">
			<h1>React Firebase Storage</h1>
			<input type="file" onChange={(e) => setImageUpload(e.target.files[0])} />
			<button onClick={uploadImage}>Upload Image</button>
			<br />
			{imageList.map((url, idx) => (
				<img src={url} alt="" key={idx} />
			))}
		</div>
	);
}

export default App;
