FROM microsoft/aspnetcore:2.0
ARG source
WORKDIR /app
EXPOSE 80 25
COPY ${source:-obj/Docker/publish} .
ENV ASPNETCORE_SMTPENDPOINTS="0.0.0.0:25"
ENTRYPOINT ["dotnet", "SmtpServerForE2ETest.dll"]
