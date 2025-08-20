import { useEffect, useState } from "react";
import "../../css/Avatar.css";
import { get, del } from "../../services/Api"; // Use the helper functions from Api.js
import UploadAvatar from "./UploadAvatar.tsx";

const AvatarList = () => {


	const [avatars, setAvatars] = useState([])


	//Henter alle avatarer under rendering, legger i listen avatars

			const getAvatars = async () => {

			const res = await get("/avatars/getall");
			//console.log(JSON.stringify(res));

			const avatarArray = res.$values || res;
			setAvatars(avatarArray);
		}

	useEffect(() => {
		getAvatars();
	}, [])

	const handleDelete = async (id) => {
		try{
			await del(`/avatars/${id}`)


			console.log("ID til slettet: ",id);
			
			//Slette siste avatar for klient
			setAvatars((prevAvatars) => prevAvatars.filter((a) => a.id !== id));

			await getAvatars();

		}catch(error){
			console.log("feilmelding: ", error)
		}
	}


	return (
		<div className="avatar-container">
		<div className="avatar-list-container">
			
			<h1 className="avatar-title">Avatarer</h1>
			<div className="avatar-grid">
				{avatars.map((avatar) => (
					<div key={avatar.id} className="avatar-item">
						<img src={avatar.url} alt={avatar.name} className="avatar-img" />
						<p className="avatar-name">{avatar.name}</p>
						<button className="slett-button" onClick={() => handleDelete(avatar.id)}>Slett</button>
						</div>
				))}
			</div>

		</div>

		<UploadAvatar onUpload={getAvatars}/>
		</div>



	)

}

export default AvatarList;