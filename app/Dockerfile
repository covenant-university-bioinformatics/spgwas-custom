FROM node:16-bullseye

ENV CI=true

WORKDIR /app

COPY ./ ./

RUN apt update

#install R and packages
RUN apt-get -y install --no-install-recommends --no-install-suggests gnupg2 gnupg1 ca-certificates software-properties-common
RUN apt-get -y install dirmngr gnupg apt-transport-https ca-certificates software-properties-common
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9
RUN add-apt-repository 'deb https://cloud.r-project.org/bin/linux/ubuntu focal-cran40/'
RUN apt-get install -y r-base

#install R and packages
RUN apt-get install -y libgsl-dev
COPY r_packages.txt ./
RUN xargs apt-get install -qq -y <r_packages.txt

RUN R -e "install.packages(c('RcppGSL','RcppZiggurat','Rfast'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('mixsqp'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('susieR'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('coloc'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('haploR'),dependencies=TRUE,repos='http://cran.rstudio.com/')"

# install jdk
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y default-jdk
RUN apt-get clean

#remove windows line endings
RUN apt-get install -y dos2unix
RUN dos2unix pipeline_scripts/coloc.sh
RUN chmod 775 pipeline_scripts/coloc.sh

COPY package.json ./

RUN npm install

RUN npm run build

CMD [ "npm", "run", "start:prod" ]
