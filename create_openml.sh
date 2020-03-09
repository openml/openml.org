npm install
cd server/src/client/app
npm run build
pip install -r requirements.txt
python create_user_table.py
flask run --cert='adhoc'
