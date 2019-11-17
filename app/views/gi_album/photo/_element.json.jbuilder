name = element.name
name = name[0, name.index('.') || name.length].humanize

json.name element.name
json.display_name name
json.dir element.dir?
json.photo element.photo?
json.video element.video?
json.path element.path

if element.photo?
  json.thumb_path element.thumb_path GiAlbum::Photo::DEF_THUMB_SIZE
  json.image_info element.image_info
end

if element.video?
end
