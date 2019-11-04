
FROM mountainpass/superlife:node-builder as install
COPY package*.json .npmrc ./
RUN npm i --production
COPY . .

FROM mountainpass/superlife:node-runtime
COPY --from=install /root .
EXPOSE 3000