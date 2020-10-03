import datetime
import spiceypy
import numpy
import pandas
import mpld3
mpld3.enable_notebook()
from mpld3 import plugins
from matplotlib import pyplot as plt

spiceypy.furnsh('naif0008.tls')
spiceypy.furnsh('de414_2000_2020.bsp')

datetime_utc=datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
datetime_ET= spiceypy.utc2et(datetime_utc)
print(datetime_utc)
print(datetime_ET)
solsys_df=pandas.DataFrame()
solsys_df.loc[:,'ET']=[datetime_ET]
solsys_df.loc[:,'UTC']=[datetime_utc]
solsys_dict={'SUN':10,'VENUS':299,'MOON':301,'MARS':4}
df = pandas.read_csv("entireexoplanetdata.csv", sep=',')
print(df['ra'])
df['ra']=df['ra']*(numpy.pi/180)-numpy.pi
df['dec']=df['dec']*(numpy.pi/180)
print(df['ra'])
ra=df['ra'].tolist()
dec=df['dec'].tolist()



'''for body_name in solsys_dict:

    # First, compute the directional vector Earth - body in ECLIPJ2000. Use
    # LT+S light time correction. spkezp returns the directional vector and
    # light time. Apply [0] to get only the vector
    solsys_df.loc[:, f'dir_{body_name}_wrt_earth_ecl'] = solsys_df['ET'] \
        .apply(lambda x: spiceypy.spkezp(targ=solsys_dict[body_name], \
                                         et=x, \
                                         ref='ECLIPJ2000', \
                                         abcorr='LT+S', \
                                         obs=399)[0])

    # Compute the longitude and latitude of the body in radians in ECLIPJ2000
    # using the function recrad. recrad returns the distance, longitude and
    # latitude value; thus, apply [1] and [2] to get the longitude and
    # latitude, respectively
    solsys_df.loc[:, f'{body_name}_long_rad_ecl'] = \
        solsys_df[f'dir_{body_name}_wrt_earth_ecl'] \
            .apply(lambda x: spiceypy.recrad(x)[1])

    solsys_df.loc[:, f'{body_name}_lat_rad_ecl'] = \
        solsys_df[f'dir_{body_name}_wrt_earth_ecl'] \
            .apply(lambda x: spiceypy.recrad(x)[2])'''




'''plt.style.use('dark_background')

# Set a figure
plt.figure(figsize=(12, 8))

# Apply the aitoff projection and activate the grid
plt.subplot(projection="aitoff")
plt.grid(True)

# Set long. / lat. labels
plt.xlabel('Long. in deg')
plt.ylabel('Lat. in deg')

# Save the figure
plt.savefig('empty_aitoff.png', dpi=300)'''


plt.style.use('dark_background')
plt.figure(figsize=(12, 8))
plt.subplot(projection="aitoff")
plt.title(f'{datetime_utc} UTC', fontsize=10)
plt.plot(0.5,0.3,marker='o')
plt.scatter(ra,dec)


plt.xticks(ticks=numpy.radians([-150, -120, -90, -60, -30, 0, \
                             30, 60, 90, 120, 150]),
           labels=['10h', '8h', '6h', '4h', '2h', '0h', \
                   '22h', '20h', '18h', '16h', '14h'])




# Plot the labels
plt.xlabel('Right ascension in hours')
plt.ylabel('Declination in deg.')

# Create a legend and grid
plt.legend()
plt.grid(True)

plt.show()