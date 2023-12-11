const fs = require('fs');
const path = require('path');

const Directo = (place) => {
	const folderInfo = fs.lstatSync(place);
	const Data_Info = {
		"path": place,
		"name": path.basename(place),
		"createdAs": folderInfo.birthtime.getTime()
	};
	if (folderInfo.isDirectory()) {
		const Folder_Files = fs.readdirSync(place);
		const Folder_Names = Folder_Files.filter(d => fs.lstatSync(path.join(place, d)).isDirectory())
		const File_Names = Folder_Files.filter(d => fs.lstatSync(path.join(place, d)).isFile())
		Data_Info.type = "directory";
		Data_Info.contents = Folder_Files.map(d => Directo(path.join(place, d)));
		Data_Info.directories = Folder_Names.length;
		Data_Info.files = File_Names.length;
	} else {
		Data_Info.type = "file";
	}
	return Data_Info;
};

exports.json = (
	place = '.'
) => {
	var Folder = place;
	if (!fs.existsSync(Folder)) {
		Folder = '.';
	}
	return Directo(Folder);
}